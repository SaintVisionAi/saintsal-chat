/**
 * app/api/playground/route.ts
 * Playground API - test different AI models with custom settings
 */
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { model, temperature, maxTokens, systemPrompt, messages } = await req.json();

    let response = "";

    // Route to appropriate model
    if (model === "gpt-5-core" || model === "gpt-5-fast") {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role === "system" ? "system" : m.role,
            content: m.content,
          })),
        ],
        temperature,
        max_tokens: maxTokens,
      });

      response = completion.choices[0]?.message?.content || "No response";
    } else if (model === "claude-sonnet-4") {
      const completion = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: messages
          .filter((m: any) => m.role !== "system")
          .map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
      });

      response =
        completion.content[0]?.type === "text"
          ? completion.content[0].text
          : "No response";
    } else if (model === "grok-3") {
      // For now, fall back to GPT
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({
            role: m.role === "system" ? "system" : m.role,
            content: m.content,
          })),
        ],
        temperature,
        max_tokens: maxTokens,
      });

      response = completion.choices[0]?.message?.content || "No response";
    }

    return NextResponse.json({
      success: true,
      response,
      model,
      settings: { temperature, maxTokens },
    });
  } catch (err: any) {
    console.error("Playground error:", err);
    return NextResponse.json(
      { error: "Failed to process request: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
