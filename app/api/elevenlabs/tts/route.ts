/**
 * app/api/elevenlabs/tts/route.ts
 * POST { text, voice? } => returns audio/mpeg
 */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, voice = "alloy" } = await req.json();
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY ?? ""
      },
      body: JSON.stringify({ text, model: "eleven_monolingual_v1" })
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("ElevenLabs error:", res.status, txt);
      return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }

    const arrayBuffer = await res.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: { "Content-Type": "audio/mpeg" }
    });
  } catch (e) {
    console.error("ElevenLabs route error:", e);
    return NextResponse.json({ error: "TTS exception" }, { status: 500 });
  }
}
