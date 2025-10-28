/**
 * app/api/chat/route.ts
 * Minimal RAG + OpenAI chat endpoint. Returns JSON { text: string }
 */
import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";
import { supabase } from "../../../lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embedText(text: string) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  return res.data[0].embedding;
}

async function ragSearch(queryEmbedding: number[], k = 5) {
  try {
    // Assumes a Supabase RPC named 'match_documents' returning id, content, metadata, score
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      k
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
  try {
    const body = await req.json();
    const userMsg: string = body.message || "";

    if (!userMsg) {
      return NextResponse.json({ text: "No message provided" }, { status: 400 });
    }

    // Persist user message to Mongo
    const db = await getDb();
    const sessions = db.collection("sessions");
    await sessions.insertOne({ role: "user", text: userMsg, createdAt: new Date() });

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

    // OpenAI chat completion
    let assistantText = "SaintSal could not generate a response.";
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg }
        ],
        max_tokens: 900
      });

      // Extract response from OpenAI completion
      assistantText =
        completion?.choices?.[0]?.message?.content ?? assistantText;
    } catch (err) {
      console.error("OpenAI error:", err);
      assistantText = "SaintSal is temporarily unavailable (LLM error).";
    }

    // Save assistant response
    await sessions.insertOne({ role: "assistant", text: assistantText, createdAt: new Date() });

    return NextResponse.json({ text: assistantText });
  } catch (err:any) {
    console.error("Unhandled /api/chat error:", err);
    return NextResponse.json({ text: "Server error: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}
