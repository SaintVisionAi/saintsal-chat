/**
 * app/api/elevenlabs/tts/route.ts
 * POST { text, voice? } => returns audio/mpeg
 */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [ELEVENLABS-TTS] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [ELEVENLABS-TTS] User authenticated: ${authCookie}`);

    const { text, voice = "EXAVITQu4vr4xnSDxMaL" } = await req.json(); // Default: Sarah (ElevenLabs)
    if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

    // ElevenLabs API requires voice_id in URL and different body structure
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY ?? ""
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
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
