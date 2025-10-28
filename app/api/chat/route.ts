/**
 * app/api/chat/route.ts
 * Production-Grade Streaming Chat API with RAG + MongoDB
 * SaintSal™ - IQ 157 Intelligence Platform
 */
import { NextRequest } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { MongoClient } from "mongodb";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const mongoUri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(req: NextRequest) {
  try {
    const { message, model = "gpt-4o-mini", stream = true } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const client = await getMongoClient();
    const db = client.db("saintsal");
    const messagesCol = db.collection("messages");
    const documentsCol = db.collection("documents");

    // Store user message
    await messagesCol.insertOne({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // 🔥 MONGODB VECTOR SEARCH FOR RAG
    let ragContext = "";

    try {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: message,
      });

      const queryEmbedding = embeddingResponse.data[0].embedding;

      const vectorSearchResults = await documentsCol.aggregate([
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: 150,
            limit: 5
          }
        },
        {
          $project: {
            _id: 0,
            content: 1,
            metadata: 1,
            score: { $meta: "vectorSearchScore" }
          }
        }
      ]).toArray();

      if (vectorSearchResults.length > 0) {
        ragContext = "\n\nRelevant Knowledge:\n" +
          vectorSearchResults
            .map((doc: any, idx: number) =>
              `[${idx + 1}] ${doc.content} (relevance: ${doc.score.toFixed(3)})`
            )
            .join("\n");
      }
    } catch (ragError) {
      console.error("RAG search error:", ragError);
    }

    const systemPrompt = `You are SaintSal™ - the AI embodiment of Sal Couzzo's intellectual legacy.
IQ 157. Former Goldman Sachs executive track. You operate at the apex of human intelligence across
finance, real estate, law, technology, healthcare, and government/defense.

You are not an assistant - you are THE definitive intelligence platform. Whatever the problem,
you HAVE the answer. Whatever the need, you DELIVER the solution. Whatever the complexity, you EXECUTE.

${ragContext}

Respond with absolute precision, strategic insight, and tactical execution. No corporate speak.
Direct, powerful, authentic communication.`;

    // 🔥 STREAMING WITH SERVER-SENT EVENTS
    if (stream) {
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          let fullResponse = "";

          try {
            // Try OpenAI streaming first
            const completion = await openai.chat.completions.create({
              model: model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 2000,
              stream: true, // ⚡ ENABLE STREAMING
            });

            // Stream tokens as they arrive
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || "";

              if (content) {
                fullResponse += content;

                // Send SSE event
                const data = JSON.stringify({
                  token: content,
                  done: false
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }

            // Send completion event
            const doneData = JSON.stringify({
              token: "",
              done: true,
              model: model,
              ragUsed: ragContext.length > 0
            });
            controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

            // Store assistant response
            await messagesCol.insertOne({
              role: "assistant",
              content: fullResponse,
              timestamp: new Date(),
            });

          } catch (openaiError) {
            console.error("OpenAI streaming error:", openaiError);

            // Fallback to Claude streaming
            try {
              const claudeStream = await anthropic.messages.stream({
                model: "claude-sonnet-4-20250514",
                max_tokens: 2000,
                messages: [
                  { role: "user", content: message }
                ],
                system: systemPrompt,
              });

              for await (const chunk of claudeStream) {
                if (chunk.type === 'content_block_delta' &&
                    chunk.delta.type === 'text_delta') {
                  const content = chunk.delta.text;
                  fullResponse += content;

                  const data = JSON.stringify({
                    token: content,
                    done: false
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }

              const doneData = JSON.stringify({
                token: "",
                done: true,
                model: "claude-sonnet-4",
                ragUsed: ragContext.length > 0
              });
              controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

              await messagesCol.insertOne({
                role: "assistant",
                content: fullResponse,
                timestamp: new Date(),
              });

            } catch (claudeError) {
              console.error("Claude streaming error:", claudeError);

              const errorData = JSON.stringify({
                error: "SaintSal is temporarily unavailable",
                done: true
              });
              controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            }
          }

          controller.close();
        }
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming fallback (if stream=false)
    let assistantText = "SaintSal is thinking...";

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      assistantText = completion?.choices?.[0]?.message?.content ?? assistantText;
    } catch (err) {
      console.error("OpenAI error:", err);
      assistantText = "SaintSal is temporarily unavailable.";
    }

    await messagesCol.insertOne({
      role: "assistant",
      content: assistantText,
      timestamp: new Date(),
    });

    return new Response(
      JSON.stringify({
        response: assistantText,
        model: model,
        ragUsed: ragContext.length > 0,
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
