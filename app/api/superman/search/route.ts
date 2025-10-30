/**
 * app/api/superman/search/route.ts
 * Web Search API for Superman Sal - Search the web and get results
 */
import { NextResponse } from "next/server";

interface RelatedTopic {
  text?: string;
  firstURL?: string;
}

export async function POST(req: Request) {
  try {
    console.log('🔍 [SUPERMAN-SEARCH] Search request received');

    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [SUPERMAN-SEARCH] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [SUPERMAN-SEARCH] User authenticated: ${authCookie}`);

    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    console.log(`🔎 [SUPERMAN-SEARCH] Searching for: "${query}"`);

    // Use Google Search API or DuckDuckGo API
    // For now, we'll use DuckDuckGo Instant Answer API (free, no key required)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    console.log(`📊 [SUPERMAN-SEARCH] Search completed`);

    // Extract relevant results
    const results = {
      query,
      abstract: data.Abstract || '',
      abstractText: data.AbstractText || '',
      abstractSource: data.AbstractSource || '',
      abstractURL: data.AbstractURL || '',
      relatedTopics: data.RelatedTopics?.slice(0, 5).map((topic: any) => ({
        text: topic.Text || '',
        firstURL: topic.FirstURL || '',
      })) || [],
      answer: data.Answer || '',
      type: data.Type || '',
      timestamp: new Date().toISOString()
    };

    // If we have an abstract, that's our main result
    if (results.abstractText) {
      console.log(`✅ [SUPERMAN-SEARCH] Found abstract: ${results.abstractText.substring(0, 100)}...`);
    }

    // Format results for display
    let formattedResults = '';

    if (results.answer) {
      formattedResults += `**Quick Answer:** ${results.answer}\n\n`;
    }

    if (results.abstractText) {
      formattedResults += `**About ${query}:**\n${results.abstractText}\n`;
      if (results.abstractURL) {
        formattedResults += `\n📖 Source: ${results.abstractSource}\n🔗 ${results.abstractURL}\n`;
      }
    }

    if (results.relatedTopics.length > 0) {
      formattedResults += `\n**Related Topics:**\n`;
      results.relatedTopics.forEach((topic: RelatedTopic, index: number) => {
        if (topic.text) {
          formattedResults += `${index + 1}. ${topic.text}\n`;
          if (topic.firstURL) {
            formattedResults += `   🔗 ${topic.firstURL}\n`;
          }
        }
      });
    }

    if (!formattedResults) {
      formattedResults = `No detailed results found for "${query}". Try searching Google: https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }

    return NextResponse.json({
      success: true,
      query,
      results: formattedResults,
      raw: results,
      searchUrl: `https://www.google.com/search?q=${encodeURIComponent(query)}`
    });

  } catch (e: any) {
    console.error("💥 [SUPERMAN-SEARCH] Error:", e);
    return NextResponse.json({
      error: "Search failed: " + (e.message || String(e)),
      success: false
    }, { status: 500 });
  }
}

/**
 * GET endpoint to check if search is available
 */
export async function GET(req: Request) {
  return NextResponse.json({
    available: true,
    provider: "DuckDuckGo Instant Answer API",
    capabilities: ["web-search", "instant-answers", "related-topics"]
  });
}
