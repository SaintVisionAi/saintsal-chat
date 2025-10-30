/**
 * app/api/integrations/google/route.ts
 * Google Calendar, Drive & Gmail Integration
 *
 * Actions:
 * CALENDAR:
 * - list_events: List calendar events
 * - create_event: Create calendar event
 *
 * DRIVE:
 * - list_files: List Drive files
 * - upload_file: Upload to Drive
 * - share_file: Share Drive file
 * - read_file: Read Drive file content
 *
 * GMAIL:
 * - list_emails: List Gmail messages
 * - send_email: Send email via Gmail
 * - read_email: Read specific email
 * - search_emails: Search emails
 */
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [GOOGLE-INTEGRATION] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [GOOGLE-INTEGRATION] User authenticated: ${authCookie}`);

    const { action, accessToken, ...params } = await req.json();

    if (!accessToken) {
      return NextResponse.json({
        error: "Access token required. Please authenticate with Google first.",
        authUrl: "/api/integrations/google/auth",
      }, { status: 401 });
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_APP_URL + "/api/integrations/google/callback"
    );

    oauth2Client.setCredentials({ access_token: accessToken });

    switch (action) {
      case "list_events": {
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const { timeMin, timeMax, maxResults = 10, calendarId = "primary" } = params;

        const response = await calendar.events.list({
          calendarId,
          timeMin: timeMin || new Date().toISOString(),
          timeMax,
          maxResults,
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = response.data.items?.map((event: any) => ({
          id: event.id,
          summary: event.summary,
          description: event.description,
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          location: event.location,
          attendees: event.attendees?.map((a: any) => a.email) || [],
          htmlLink: event.htmlLink,
        })) || [];

        return NextResponse.json({
          success: true,
          events,
        });
      }

      case "create_event": {
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const {
          summary,
          description,
          startDateTime,
          endDateTime,
          location,
          attendees = [],
          calendarId = "primary",
          timezone = "America/New_York"
        } = params;

        const event = {
          summary,
          description,
          location,
          start: {
            dateTime: startDateTime,
            timeZone: timezone,
          },
          end: {
            dateTime: endDateTime,
            timeZone: timezone,
          },
          attendees: attendees.map((email: string) => ({ email })),
          reminders: {
            useDefault: true,
          },
        };

        const response = await calendar.events.insert({
          calendarId,
          requestBody: event,
        });

        return NextResponse.json({
          success: true,
          event: {
            id: response.data.id,
            summary: response.data.summary,
            htmlLink: response.data.htmlLink,
            start: response.data.start,
            end: response.data.end,
          },
        });
      }

      case "list_files": {
        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const { pageSize = 10, query = "", orderBy = "modifiedTime desc" } = params;

        const response = await drive.files.list({
          pageSize,
          q: query,
          orderBy,
          fields: "files(id, name, mimeType, size, modifiedTime, webViewLink, thumbnailLink)",
        });

        const files = response.data.files?.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
          modifiedTime: file.modifiedTime,
          webViewLink: file.webViewLink,
          thumbnailLink: file.thumbnailLink,
        })) || [];

        return NextResponse.json({
          success: true,
          files,
        });
      }

      case "upload_file": {
        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const { fileName, mimeType, content, folderId } = params;

        const fileMetadata: any = {
          name: fileName,
        };

        if (folderId) {
          fileMetadata.parents = [folderId];
        }

        const media = {
          mimeType,
          body: Buffer.from(content, "base64"),
        };

        const response = await drive.files.create({
          requestBody: fileMetadata,
          media: media as any,
          fields: "id, name, webViewLink",
        });

        return NextResponse.json({
          success: true,
          file: {
            id: response.data.id,
            name: response.data.name,
            webViewLink: response.data.webViewLink,
          },
        });
      }

      case "share_file": {
        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const { fileId, email, role = "reader" } = params;

        await drive.permissions.create({
          fileId,
          requestBody: {
            type: "user",
            role, // reader, writer, commenter
            emailAddress: email,
          },
        });

        return NextResponse.json({
          success: true,
          message: `File shared with ${email}`,
        });
      }

      case "read_file": {
        const drive = google.drive({ version: "v3", auth: oauth2Client });
        const { fileId } = params;

        const response = await drive.files.get({
          fileId,
          alt: "media",
        });

        return NextResponse.json({
          success: true,
          content: response.data,
        });
      }

      // GMAIL ACTIONS
      case "list_emails": {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const { maxResults = 10, query } = params;

        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults,
          q: query,
        });

        const messages = response.data.messages || [];
        const emails = [];

        for (const message of messages.slice(0, maxResults)) {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: message.id!,
            format: "metadata",
            metadataHeaders: ["From", "Subject", "Date"],
          });

          const headers = email.data.payload?.headers || [];
          emails.push({
            id: email.data.id,
            threadId: email.data.threadId,
            snippet: email.data.snippet,
            from: headers.find((h) => h.name === "From")?.value,
            subject: headers.find((h) => h.name === "Subject")?.value,
            date: headers.find((h) => h.name === "Date")?.value,
          });
        }

        return NextResponse.json({
          success: true,
          emails,
        });
      }

      case "send_email": {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const { to, subject, body, cc, bcc } = params;

        const rawMessage = [
          `To: ${to}`,
          cc ? `Cc: ${cc}` : "",
          bcc ? `Bcc: ${bcc}` : "",
          `Subject: ${subject}`,
          "Content-Type: text/html; charset=utf-8",
          "",
          body,
        ]
          .filter(Boolean)
          .join("\n");

        const encodedMessage = Buffer.from(rawMessage)
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        await gmail.users.messages.send({
          userId: "me",
          requestBody: {
            raw: encodedMessage,
          },
        });

        return NextResponse.json({
          success: true,
          message: "Email sent successfully",
        });
      }

      case "read_email": {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const { emailId } = params;

        const response = await gmail.users.messages.get({
          userId: "me",
          id: emailId,
          format: "full",
        });

        const headers = response.data.payload?.headers || [];
        const parts = response.data.payload?.parts || [];

        // Get email body
        let body = "";
        const part = parts.find((p) => p.mimeType === "text/html") || parts.find((p) => p.mimeType === "text/plain");
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, "base64").toString("utf-8");
        }

        return NextResponse.json({
          success: true,
          email: {
            id: response.data.id,
            threadId: response.data.threadId,
            from: headers.find((h) => h.name === "From")?.value,
            to: headers.find((h) => h.name === "To")?.value,
            subject: headers.find((h) => h.name === "Subject")?.value,
            date: headers.find((h) => h.name === "Date")?.value,
            body,
            snippet: response.data.snippet,
          },
        });
      }

      case "search_emails": {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const { query, maxResults = 10 } = params;

        const response = await gmail.users.messages.list({
          userId: "me",
          maxResults,
          q: query,
        });

        const messages = response.data.messages || [];
        const emails = [];

        for (const message of messages) {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: message.id!,
            format: "metadata",
            metadataHeaders: ["From", "Subject", "Date"],
          });

          const headers = email.data.payload?.headers || [];
          emails.push({
            id: email.data.id,
            snippet: email.data.snippet,
            from: headers.find((h) => h.name === "From")?.value,
            subject: headers.find((h) => h.name === "Subject")?.value,
            date: headers.find((h) => h.name === "Date")?.value,
          });
        }

        return NextResponse.json({
          success: true,
          emails,
        });
      }

      default:
        return NextResponse.json({
          error: "Invalid action. Available: list_events, create_event, list_files, upload_file, share_file, read_file, list_emails, send_email, read_email, search_emails",
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Google API error:", error);

    if (error.code === 401) {
      return NextResponse.json({
        error: "Authentication failed. Please re-authenticate with Google.",
        authUrl: "/api/integrations/google/auth",
      }, { status: 401 });
    }

    return NextResponse.json({
      error: error.message || "Google integration failed",
    }, { status: 500 });
  }
}
