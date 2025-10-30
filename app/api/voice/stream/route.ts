/**
 * app/api/voice/stream/route.ts
 * SaintSal™ Walkie Talkie - Real-time voice-to-voice streaming
 * The smoothest voice experience on the planet
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [VOICE-STREAM] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [VOICE-STREAM] User authenticated: ${authCookie}`);

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    const context = formData.get("context") as string; // Previous conversation context

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Step 1: Speech-to-Text (Whisper)
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    });

    const userText = transcription.text;

    // Step 2: Generate AI Response
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are SaintSal™, a helpful AI assistant. Keep responses conversational, natural, and concise for voice interaction. Speak like a friend.",
        },
        ...(context ? JSON.parse(context) : []),
        {
          role: "user",
          content: userText,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I didn't catch that.";

    // Step 3: Return both text and prepare for TTS
    return NextResponse.json({
      success: true,
      userText,
      aiResponse,
      timestamp: new Date(),
    });
  } catch (err: any) {
    console.error("Voice stream error:", err);
    return NextResponse.json({ error: "Voice stream failed: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}

// GET endpoint for streaming audio response
export async function GET(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [VOICE-TTS] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [VOICE-TTS] User authenticated: ${authCookie}`);

    const { searchParams } = new URL(req.url);
    const text = searchParams.get("text");

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call ElevenLabs for TTS streaming
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default voice

    if (!elevenLabsApiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsApiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5", // Fastest model for real-time streaming
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("ElevenLabs TTS failed");
    }

    // Stream the audio directly to the client
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: any) {
    console.error("TTS stream error:", err);
    return NextResponse.json({ error: "TTS stream failed: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}
