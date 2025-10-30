/**
 * app/api/tools/code/route.ts
 * Code Agent - Generate and execute code
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
      console.log('❌ [TOOLS-CODE] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [TOOLS-CODE] User authenticated: ${authCookie}`);

    const { action, prompt, code, language } = await req.json();

    if (action === "generate") {
      // Generate code based on prompt
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a code generation expert. Generate clean, production-ready code.

Rules:
- Always include comments
- Follow best practices
- Return ONLY the code, no explanations
- Use the specified language: ${language || "javascript"}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const generatedCode = completion.choices[0]?.message?.content || "";

      return NextResponse.json({
        success: true,
        code: generatedCode,
        language: language || "javascript",
      });
    } else if (action === "explain") {
      // Explain existing code
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a code explainer. Explain code clearly and concisely.",
          },
          {
            role: "user",
            content: `Explain this code:\n\n${code}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      });

      const explanation = completion.choices[0]?.message?.content || "";

      return NextResponse.json({
        success: true,
        explanation,
      });
    } else if (action === "fix") {
      // Fix buggy code
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a code debugger. Fix bugs and improve code quality.

Return:
1. The fixed code
2. A brief explanation of what was wrong`,
          },
          {
            role: "user",
            content: `Fix this code:\n\n${code}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content || "";

      return NextResponse.json({
        success: true,
        fixedCode: response,
      });
    } else if (action === "execute") {
      // For safety, we won't actually execute arbitrary code
      // Instead, return a simulated execution result
      return NextResponse.json({
        success: true,
        output: "Code execution simulated. In production, use a sandboxed environment.",
        warning: "Actual code execution requires a secure sandbox.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use: generate, explain, fix, or execute" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Code Agent error:", err);
    return NextResponse.json(
      { error: "Code Agent failed: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
