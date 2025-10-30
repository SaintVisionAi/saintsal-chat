/**
 * app/api/elevenlabs/tts/route.ts
 * POST { text, voice? } => returns audio/mpeg
 */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log('🎤 [ELEVENLABS-TTS] TTS request received');

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
    console.log(`📝 [ELEVENLABS-TTS] Text length: ${text?.length || 0} chars, Voice: ${voice}`);
    console.log(`📝 [ELEVENLABS-TTS] Text preview: ${text?.substring(0, 100)}...`);

    if (!text) {
      console.log('❌ [ELEVENLABS-TTS] Missing text parameter');
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Check API key
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('❌ [ELEVENLABS-TTS] ELEVENLABS_API_KEY is not set in environment!');
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
    }
    console.log(`🔑 [ELEVENLABS-TTS] API key found: ${apiKey.substring(0, 8)}...`);

    // ElevenLabs API requires voice_id in URL and different body structure
    console.log(`📡 [ELEVENLABS-TTS] Calling ElevenLabs API...`);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
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

    console.log(`📊 [ELEVENLABS-TTS] ElevenLabs API response status: ${res.status}`);

    if (!res.ok) {
      const txt = await res.text();
      console.error(`❌ [ELEVENLABS-TTS] ElevenLabs error: ${res.status} - ${txt}`);
      return NextResponse.json({ error: "TTS failed: " + txt }, { status: 500 });
    }

    const arrayBuffer = await res.arrayBuffer();
    console.log(`🎵 [ELEVENLABS-TTS] Audio received: ${arrayBuffer.byteLength} bytes`);

    if (arrayBuffer.byteLength === 0) {
      console.error('❌ [ELEVENLABS-TTS] Received empty audio buffer!');
      return NextResponse.json({ error: "Empty audio received" }, { status: 500 });
    }

    console.log('✅ [ELEVENLABS-TTS] Sending audio to client');
    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: { "Content-Type": "audio/mpeg" }
    });
  } catch (e) {
    console.error("💥 [ELEVENLABS-TTS] Exception:", e);
    return NextResponse.json({ error: "TTS exception: " + String(e) }, { status: 500 });
  }
}
