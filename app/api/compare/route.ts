/**
 * app/api/compare/route.ts
 * Run the same prompt across multiple AI models
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ModelResponse {
  model: string;
  response: string;
  tokens: number;
  duration: number;
  error?: string;
}

export async function POST(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [COMPARE] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [COMPARE] User authenticated: ${authCookie}`);

    const { prompt, models = ["gpt-5-core", "claude-sonnet-4", "grok-3"] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const results: ModelResponse[] = [];

    // Run all models in parallel
    const promises = models.map(async (model: string) => {
      const startTime = Date.now();
      let response = "";
      let tokens = 0;
      let error = undefined;

      try {
        if (model === "gpt-5-core" || model === "gpt-5-fast" || model === "grok-3") {
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
          });

          response = completion.choices[0]?.message?.content || "No response";
          tokens = completion.usage?.total_tokens || 0;
        } else if (model === "claude-sonnet-4") {
          const completion = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          });

          response =
            completion.content[0]?.type === "text"
              ? completion.content[0].text
              : "No response";
          tokens = completion.usage?.input_tokens + completion.usage?.output_tokens || 0;
        }
      } catch (err: any) {
        error = err?.message || String(err);
        response = `Error: ${error}`;
      }

      const duration = Date.now() - startTime;

      return {
        model,
        response,
        tokens,
        duration,
        error,
      };
    });

    const allResults = await Promise.all(promises);
    results.push(...allResults);

    // Calculate winner (fastest + longest response)
    const winner = results.reduce((best, current) => {
      if (current.error) return best;
      const currentScore = current.response.length / current.duration;
      const bestScore = best.response.length / best.duration;
      return currentScore > bestScore ? current : best;
    }, results[0]);

    return NextResponse.json({
      success: true,
      prompt,
      results,
      winner: winner.model,
      timestamp: new Date(),
    });
  } catch (err: any) {
    console.error("Model comparison error:", err);
    return NextResponse.json(
      { error: "Comparison failed: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
