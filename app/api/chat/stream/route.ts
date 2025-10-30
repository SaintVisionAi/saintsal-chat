/**
 * app/api/chat/stream/route.ts
 * Streaming chat responses with Server-Sent Events
 */
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import { supabase } from "../../../../lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embedText(text: string) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

async function ragSearch(queryEmbedding: number[], k = 5) {
  try {
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      k,
    });
    if (error) {
      console.error("Supabase RAG error:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error("RAG exception:", e);
    return [];
  }
}

export async function POST(req: Request) {
  const encoder = new TextEncoder();

  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [CHAT-STREAM] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [CHAT-STREAM] User authenticated: ${authCookie}`);

    const body = await req.json();
    const userMsg: string = body.message || "";

    if (!userMsg) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Persist user message to Mongo
          const db = await getDb();
          const sessions = db.collection("sessions");
          await sessions.insertOne({ role: "user", text: userMsg, createdAt: new Date() });

          // Send start event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "start" })}\n\n`)
          );

          // Embedding + RAG
          const embedding = await embedText(userMsg);
          let docs: any[] = [];
          try {
            docs = await ragSearch(embedding, 6);
          } catch (e) {
            docs = [];
          }

          const ragText = docs.map((d, i) => `DOC ${i + 1}:\n${d.content}\n---\n`).join("\n");
          const systemPrompt = `You are SaintSal, a faith-driven AI co-founder. Use the following documents as context if relevant:\n\n${ragText}\n\nAnswer concisely and provide clear next steps when appropriate.`;

          // OpenAI streaming
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userMsg },
            ],
            max_tokens: 900,
            stream: true,
          });

          let fullResponse = "";
          let tokenCount = 0;

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              tokenCount++;

              // Send chunk to client
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "chunk",
                    content,
                    tokenCount,
                  })}\n\n`
                )
              );
            }
          }

          // Save assistant response
          await sessions.insertOne({
            role: "assistant",
            text: fullResponse,
            createdAt: new Date(),
          });

          // Send completion event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "done",
                fullResponse,
                tokenCount,
              })}\n\n`
            )
          );

          controller.close();
        } catch (err: any) {
          console.error("Streaming error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: err?.message || String(err),
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Unhandled streaming error:", err);
    return NextResponse.json(
      { error: "Server error: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
