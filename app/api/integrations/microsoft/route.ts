/**
 * app/api/integrations/microsoft/route.ts
 * Microsoft Graph API Integration - Calendar, OneDrive, SharePoint, Outlook Email
 *
 * Actions:
 * CALENDAR:
 * - list_events: List calendar events
 * - create_event: Create calendar event
 *
 * ONEDRIVE:
 * - list_files: List OneDrive files
 * - upload_file: Upload to OneDrive
 * - share_file: Share OneDrive file
 * - read_file: Read OneDrive file content
 * - search_files: Search files in OneDrive
 *
 * SHAREPOINT:
 * - list_sharepoint_sites: List SharePoint sites
 * - list_sharepoint_files: List files in SharePoint
 * - upload_sharepoint_file: Upload to SharePoint
 * - get_sharepoint_lists: Get SharePoint lists
 *
 * EMAIL (OUTLOOK):
 * - list_emails: List emails from inbox
 * - send_email: Send email via Outlook
 * - read_email: Read specific email
 * - search_emails: Search emails
 */
import { NextRequest, NextResponse } from "next/server";

const MS_GRAPH_API = "https://graph.microsoft.com/v1.0";

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [MICROSOFT-INTEGRATION] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [MICROSOFT-INTEGRATION] User authenticated: ${authCookie}`);

    const { action, accessToken, ...params } = await req.json();

    if (!accessToken) {
      return NextResponse.json({
        error: "Access token required. Please authenticate with Microsoft first.",
        authUrl: "/api/integrations/microsoft/auth",
      }, { status: 401 });
    }

    const headers = {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    switch (action) {
      case "list_events": {
        const { startDateTime, endDateTime, top = 10 } = params;

        let url = `${MS_GRAPH_API}/me/calendar/events?$top=${top}&$orderby=start/dateTime`;

        if (startDateTime) {
          url += `&$filter=start/dateTime ge '${startDateTime}'`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();

        const events = data.value?.map((event: any) => ({
          id: event.id,
          subject: event.subject,
          bodyPreview: event.bodyPreview,
          start: event.start,
          end: event.end,
          location: event.location?.displayName,
          attendees: event.attendees?.map((a: any) => a.emailAddress?.address) || [],
          webLink: event.webLink,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          events,
        });
      }

      case "create_event": {
        const {
          subject,
          body,
          startDateTime,
          endDateTime,
          location,
          attendees = [],
          timezone = "Eastern Standard Time"
        } = params;

        const event = {
          subject,
          body: {
            contentType: "HTML",
            content: body,
          },
          start: {
            dateTime: startDateTime,
            timeZone: timezone,
          },
          end: {
            dateTime: endDateTime,
            timeZone: timezone,
          },
          location: {
            displayName: location,
          },
          attendees: attendees.map((email: string) => ({
            emailAddress: {
              address: email,
            },
            type: "required",
          })),
        };

        const response = await fetch(`${MS_GRAPH_API}/me/calendar/events`, {
          method: "POST",
          headers,
          body: JSON.stringify(event),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          event: {
            id: data.id,
            subject: data.subject,
            webLink: data.webLink,
            start: data.start,
            end: data.end,
          },
        });
      }

      case "list_files": {
        const { top = 10, orderBy = "lastModifiedDateTime desc" } = params;

        const response = await fetch(
          `${MS_GRAPH_API}/me/drive/root/children?$top=${top}&$orderby=${orderBy}`,
          { headers }
        );

        const data = await response.json();

        const files = data.value?.map((file: any) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          createdDateTime: file.createdDateTime,
          lastModifiedDateTime: file.lastModifiedDateTime,
          webUrl: file.webUrl,
          downloadUrl: file["@microsoft.graph.downloadUrl"],
        })) || [];

        return NextResponse.json({
          success: response.ok,
          files,
        });
      }

      case "upload_file": {
        const { fileName, content, folderPath = "/" } = params;

        const uploadUrl = folderPath === "/"
          ? `${MS_GRAPH_API}/me/drive/root:/${fileName}:/content`
          : `${MS_GRAPH_API}/me/drive/root:${folderPath}/${fileName}:/content`;

        const response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/octet-stream",
          },
          body: Buffer.from(content, "base64"),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          file: {
            id: data.id,
            name: data.name,
            webUrl: data.webUrl,
            size: data.size,
          },
        });
      }

      case "share_file": {
        const { fileId, email, role = "read" } = params;

        const response = await fetch(`${MS_GRAPH_API}/me/drive/items/${fileId}/invite`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            recipients: [
              {
                email,
              },
            ],
            message: "File shared via SaintSal AI",
            requireSignIn: true,
            sendInvitation: true,
            roles: [role], // read, write, owner
          }),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          message: `File shared with ${email}`,
          permission: data,
        });
      }

      case "read_file": {
        const { fileId } = params;

        const response = await fetch(`${MS_GRAPH_API}/me/drive/items/${fileId}/content`, {
          headers,
        });

        const content = await response.text();

        return NextResponse.json({
          success: response.ok,
          content,
        });
      }

      case "search_files": {
        const { query } = params;

        const response = await fetch(
          `${MS_GRAPH_API}/me/drive/root/search(q='${encodeURIComponent(query)}')`,
          { headers }
        );

        const data = await response.json();

        const files = data.value?.map((file: any) => ({
          id: file.id,
          name: file.name,
          webUrl: file.webUrl,
          size: file.size,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          files,
        });
      }

      // SHAREPOINT ACTIONS
      case "list_sharepoint_sites": {
        const response = await fetch(`${MS_GRAPH_API}/sites?search=*`, { headers });
        const data = await response.json();

        const sites = data.value?.map((site: any) => ({
          id: site.id,
          name: site.displayName,
          webUrl: site.webUrl,
          description: site.description,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          sites,
        });
      }

      case "list_sharepoint_files": {
        const { siteId, driveId } = params;

        const response = await fetch(
          `${MS_GRAPH_API}/sites/${siteId}/drives/${driveId}/root/children`,
          { headers }
        );

        const data = await response.json();

        const files = data.value?.map((file: any) => ({
          id: file.id,
          name: file.name,
          webUrl: file.webUrl,
          size: file.size,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          files,
        });
      }

      case "upload_sharepoint_file": {
        const { siteId, driveId, fileName, content } = params;

        const response = await fetch(
          `${MS_GRAPH_API}/sites/${siteId}/drives/${driveId}/root:/${fileName}:/content`,
          {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/octet-stream",
            },
            body: Buffer.from(content, "base64"),
          }
        );

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          file: {
            id: data.id,
            name: data.name,
            webUrl: data.webUrl,
          },
        });
      }

      case "get_sharepoint_lists": {
        const { siteId } = params;

        const response = await fetch(`${MS_GRAPH_API}/sites/${siteId}/lists`, { headers });
        const data = await response.json();

        const lists = data.value?.map((list: any) => ({
          id: list.id,
          name: list.displayName,
          description: list.description,
          webUrl: list.webUrl,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          lists,
        });
      }

      // EMAIL (OUTLOOK) ACTIONS
      case "list_emails": {
        const { top = 10, filter } = params;

        let url = `${MS_GRAPH_API}/me/messages?$top=${top}&$orderby=receivedDateTime desc`;
        if (filter) {
          url += `&$filter=${filter}`;
        }

        const response = await fetch(url, { headers });
        const data = await response.json();

        const emails = data.value?.map((email: any) => ({
          id: email.id,
          subject: email.subject,
          from: email.from?.emailAddress?.address,
          receivedDateTime: email.receivedDateTime,
          bodyPreview: email.bodyPreview,
          isRead: email.isRead,
          hasAttachments: email.hasAttachments,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          emails,
        });
      }

      case "send_email": {
        const { to, subject, body, cc = [], bcc = [], attachments = [] } = params;

        const message = {
          subject,
          body: {
            contentType: "HTML",
            content: body,
          },
          toRecipients: (Array.isArray(to) ? to : [to]).map((email: string) => ({
            emailAddress: { address: email },
          })),
          ccRecipients: cc.map((email: string) => ({
            emailAddress: { address: email },
          })),
          bccRecipients: bcc.map((email: string) => ({
            emailAddress: { address: email },
          })),
          attachments: attachments.map((att: any) => ({
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: att.name,
            contentBytes: att.contentBytes,
          })),
        };

        const response = await fetch(`${MS_GRAPH_API}/me/sendMail`, {
          method: "POST",
          headers,
          body: JSON.stringify({ message, saveToSentItems: true }),
        });

        return NextResponse.json({
          success: response.ok,
          message: response.ok ? "Email sent successfully" : "Failed to send email",
        });
      }

      case "read_email": {
        const { emailId } = params;

        const response = await fetch(`${MS_GRAPH_API}/me/messages/${emailId}`, { headers });
        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          email: {
            id: data.id,
            subject: data.subject,
            from: data.from?.emailAddress,
            receivedDateTime: data.receivedDateTime,
            body: data.body?.content,
            bodyPreview: data.bodyPreview,
            attachments: data.hasAttachments,
          },
        });
      }

      case "search_emails": {
        const { query } = params;

        const response = await fetch(
          `${MS_GRAPH_API}/me/messages?$search="${encodeURIComponent(query)}"`,
          { headers }
        );

        const data = await response.json();

        const emails = data.value?.map((email: any) => ({
          id: email.id,
          subject: email.subject,
          from: email.from?.emailAddress?.address,
          receivedDateTime: email.receivedDateTime,
          bodyPreview: email.bodyPreview,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          emails,
        });
      }

      default:
        return NextResponse.json({
          error: "Invalid action. Available: list_events, create_event, list_files, upload_file, share_file, read_file, search_files, list_sharepoint_sites, list_sharepoint_files, upload_sharepoint_file, get_sharepoint_lists, list_emails, send_email, read_email, search_emails",
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Microsoft API error:", error);

    if (error.status === 401) {
      return NextResponse.json({
        error: "Authentication failed. Please re-authenticate with Microsoft.",
        authUrl: "/api/integrations/microsoft/auth",
      }, { status: 401 });
    }

    return NextResponse.json({
      error: error.message || "Microsoft integration failed",
    }, { status: 500 });
  }
}
