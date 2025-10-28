/**
 * app/api/voice/stt/route.ts
 * Speech-to-Text using OpenAI Whisper
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert to File object for OpenAI
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    });

    return NextResponse.json({
      success: true,
      text: transcription.text,
    });
  } catch (err: any) {
    console.error("STT error:", err);
    return NextResponse.json(
      { error: "Speech-to-text failed: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
