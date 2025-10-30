/**
 * app/api/export/route.ts
 * Export chat conversations to different formats
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

interface Message {
  role: string;
  content: string;
  timestamp?: Date;
}

interface ExportRequest {
  chatId: string;
  format: "markdown" | "json" | "text";
  messages: Message[];
  title?: string;
}

export async function POST(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [EXPORT] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [EXPORT] User authenticated: ${authCookie}`);

    const { chatId, format, messages, title } = (await req.json()) as ExportRequest;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages to export" }, { status: 400 });
    }

    const chatTitle = title || `SaintSal™ Chat - ${new Date().toLocaleDateString()}`;

    if (format === "markdown") {
      const markdown = generateMarkdown(messages, chatTitle);
      return new NextResponse(markdown, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="saintsal-chat-${chatId}.md"`,
        },
      });
    } else if (format === "json") {
      const json = {
        platform: "SaintSal™",
        chatId,
        title: chatTitle,
        exportedAt: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp || new Date(),
        })),
      };

      return new NextResponse(JSON.stringify(json, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="saintsal-chat-${chatId}.json"`,
        },
      });
    } else if (format === "text") {
      const text = generatePlainText(messages, chatTitle);
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain",
          "Content-Disposition": `attachment; filename="saintsal-chat-${chatId}.txt"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format. Use: markdown, json, or text" }, { status: 400 });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}

function generateMarkdown(messages: Message[], title: string): string {
  let markdown = `# ${title}\n\n`;
  markdown += `**Platform:** SaintSal™ AI Chat\n\n`;
  markdown += `**Exported:** ${new Date().toLocaleString()}\n\n`;
  markdown += `**Message Count:** ${messages.length}\n\n`;
  markdown += `---\n\n`;

  messages.forEach((msg, index) => {
    const role = msg.role === "user" ? "👤 You" : "🤖 SaintSal™";
    const timestamp = msg.timestamp ? ` _(${new Date(msg.timestamp).toLocaleTimeString()})_` : "";

    markdown += `### ${role}${timestamp}\n\n`;
    markdown += `${msg.content}\n\n`;

    if (index < messages.length - 1) {
      markdown += `---\n\n`;
    }
  });

  markdown += `\n\n---\n\n`;
  markdown += `_Exported from SaintSal™ - Your AI-Powered Assistant_\n`;

  return markdown;
}

function generatePlainText(messages: Message[], title: string): string {
  let text = `${title}\n`;
  text += `${"=".repeat(title.length)}\n\n`;
  text += `Platform: SaintSal™ AI Chat\n`;
  text += `Exported: ${new Date().toLocaleString()}\n`;
  text += `Message Count: ${messages.length}\n\n`;
  text += `${"-".repeat(80)}\n\n`;

  messages.forEach((msg, index) => {
    const role = msg.role === "user" ? "YOU" : "SAINTSAL™";
    const timestamp = msg.timestamp ? ` [${new Date(msg.timestamp).toLocaleTimeString()}]` : "";

    text += `${role}${timestamp}:\n`;
    text += `${msg.content}\n\n`;

    if (index < messages.length - 1) {
      text += `${"-".repeat(80)}\n\n`;
    }
  });

  text += `${"-".repeat(80)}\n`;
  text += `\nExported from SaintSal™ - Your AI-Powered Assistant\n`;

  return text;
}

// GET endpoint to retrieve chat history for export
export async function GET(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const userId = authCookieMatch ? authCookieMatch[1] : null;

    if (!userId) {
      console.log('❌ [EXPORT-GET] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [EXPORT-GET] User authenticated: ${userId}`);

    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ error: "chatId is required" }, { status: 400 });
    }

    const db = await getDb();
    const chats = db.collection("chats");

    const chat = await chats.findOne({ chatId, userId });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      chatId: chat.chatId,
      title: chat.title || `SaintSal™ Chat - ${chatId}`,
      messages: chat.messages || [],
      createdAt: chat.createdAt,
    });
  } catch (err: any) {
    console.error("Get chat error:", err);
    return NextResponse.json({ error: "Failed to retrieve chat: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}
