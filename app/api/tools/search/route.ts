/**
 * app/api/tools/search/route.ts
 * Web Search using Serper API or Brave Search
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [TOOLS-SEARCH] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [TOOLS-SEARCH] User authenticated: ${authCookie}`);

    const { query, num_results = 5 } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Use Serper API if available, otherwise use Brave Search
    const serperApiKey = process.env.SERPER_API_KEY;
    const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;

    if (serperApiKey) {
      // Serper API (https://serper.dev)
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: query,
          num: num_results,
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API error: ${response.status}`);
      }

      const data = await response.json();

      // Format results
      const results = data.organic?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        position: item.position,
      })) || [];

      return NextResponse.json({
        success: true,
        query,
        results,
        answerBox: data.answerBox || null,
        knowledgeGraph: data.knowledgeGraph || null,
      });
    } else if (braveApiKey) {
      // Brave Search API
      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${num_results}`,
        {
          headers: {
            "X-Subscription-Token": braveApiKey,
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status}`);
      }

      const data = await response.json();

      const results = data.web?.results?.map((item: any, index: number) => ({
        title: item.title,
        link: item.url,
        snippet: item.description,
        position: index + 1,
      })) || [];

      return NextResponse.json({
        success: true,
        query,
        results,
        answerBox: null,
        knowledgeGraph: null,
      });
    } else {
      // No API key available - return instructional message
      return NextResponse.json({
        success: false,
        error: "No search API key configured. Please add SERPER_API_KEY or BRAVE_SEARCH_API_KEY to .env.local",
        instructions: [
          "Option 1: Get free API key from https://serper.dev (2,500 free searches)",
          "Option 2: Get Brave Search API key from https://brave.com/search/api/",
          "Add to .env.local: SERPER_API_KEY=your_key_here",
        ],
      }, { status: 503 });
    }
  } catch (error: any) {
    console.error("Web search error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to perform web search",
      },
      { status: 500 }
    );
  }
}
