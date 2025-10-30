/**
 * app/api/tools/image/route.ts
 * Image Generation using DALL-E 3
 */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [TOOLS-IMAGE] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [TOOLS-IMAGE] User authenticated: ${authCookie}`);

    const { prompt, size = "1024x1024", quality = "standard" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Generate image using DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: quality as "standard" | "hd",
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    if (!imageUrl) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      revisedPrompt,
      originalPrompt: prompt,
    });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
