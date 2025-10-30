/**
 * app/api/superman/vision/route.ts
 * Vision API for Superman Sal - Analyze images, screenshots, or webpage content
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    console.log('👁️ [SUPERMAN-VISION] Vision API request received');

    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [SUPERMAN-VISION] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [SUPERMAN-VISION] User authenticated: ${authCookie}`);

    const contentType = req.headers.get('content-type') || '';

    let imageData = '';
    let analysisPrompt = 'Analyze this image in detail and describe what you see. Focus on the content, layout, text, and any notable elements.';

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload (screenshot)
      const formData = await req.formData();
      const file = formData.get('image') as File;
      const prompt = formData.get('prompt') as string;

      if (prompt) {
        analysisPrompt = prompt;
      }

      if (!file) {
        return NextResponse.json({ error: 'No image provided' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      imageData = `data:${file.type};base64,${base64}`;
      console.log(`📸 [SUPERMAN-VISION] Screenshot uploaded: ${file.name} (${file.size} bytes)`);
    } else {
      // Handle JSON with base64 image or URL
      const body = await req.json();
      const { imageUrl, imageBase64, prompt } = body;

      if (prompt) {
        analysisPrompt = prompt;
      }

      if (imageUrl) {
        imageData = imageUrl;
        console.log(`🔗 [SUPERMAN-VISION] Analyzing image from URL: ${imageUrl}`);
      } else if (imageBase64) {
        imageData = imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`;
        console.log(`📊 [SUPERMAN-VISION] Analyzing base64 image`);
      } else {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }
    }

    console.log(`🤖 [SUPERMAN-VISION] Calling OpenAI Vision API...`);
    console.log(`📝 [SUPERMAN-VISION] Prompt: ${analysisPrompt.substring(0, 100)}...`);

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // gpt-4o-mini has vision capabilities
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageData,
                detail: "high" // Use high detail for better analysis
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const analysis = response.choices[0]?.message?.content || "Unable to analyze image";
    console.log(`✅ [SUPERMAN-VISION] Analysis complete: ${analysis.substring(0, 100)}...`);

    return NextResponse.json({
      success: true,
      analysis,
      model: "gpt-4o-mini",
      timestamp: new Date().toISOString()
    });

  } catch (e: any) {
    console.error("💥 [SUPERMAN-VISION] Error:", e);
    return NextResponse.json({
      error: "Vision analysis failed: " + (e.message || String(e)),
      success: false
    }, { status: 500 });
  }
}

/**
 * Optional: GET endpoint to check if vision API is available
 */
export async function GET(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    return NextResponse.json({
      available: !!apiKey,
      model: "gpt-4o-mini",
      capabilities: ["image-analysis", "screenshot-analysis", "visual-understanding"]
    });
  } catch (e) {
    return NextResponse.json({
      available: false,
      error: String(e)
    }, { status: 500 });
  }
}
