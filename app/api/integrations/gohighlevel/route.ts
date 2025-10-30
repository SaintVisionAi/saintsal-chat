/**
 * app/api/integrations/gohighlevel/route.ts
 * GoHighLevel CRM Integration
 *
 * Actions:
 * - create_contact: Create/update contact in GHL
 * - get_contact: Get contact by email or phone
 * - create_opportunity: Create sales opportunity
 * - send_message: Send SMS/Email via GHL
 * - add_tag: Add tag to contact
 * - create_appointment: Schedule appointment
 */
import { NextRequest, NextResponse } from "next/server";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_URL = "https://rest.gohighlevel.com/v1";

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [GHL] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [GHL] User authenticated: ${authCookie}`);

    if (!GHL_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "GoHighLevel not configured",
        instructions: [
          "1. Go to https://app.gohighlevel.com/settings/integrations",
          "2. Create API Key with required permissions",
          "3. Add to .env.local: GHL_API_KEY=your_key",
          "4. Add to .env.local: GHL_LOCATION_ID=your_location_id",
        ],
      }, { status: 503 });
    }

    const { action, ...params } = await req.json();

    const headers = {
      "Authorization": `Bearer ${GHL_API_KEY}`,
      "Content-Type": "application/json",
    };

    switch (action) {
      case "create_contact": {
        const { firstName, lastName, email, phone, tags = [], customFields = {} } = params;

        const response = await fetch(`${GHL_API_URL}/contacts`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            tags,
            customFields,
            locationId: GHL_LOCATION_ID,
          }),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          contact: data.contact || data,
          message: response.ok ? "Contact created successfully" : "Failed to create contact",
        });
      }

      case "get_contact": {
        const { email, phone } = params;
        const searchParam = email ? `email=${email}` : `phone=${phone}`;

        const response = await fetch(`${GHL_API_URL}/contacts?${searchParam}&locationId=${GHL_LOCATION_ID}`, {
          headers,
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          contacts: data.contacts || [],
        });
      }

      case "create_opportunity": {
        const { contactId, pipelineId, stageId, name, monetaryValue, status = "open" } = params;

        const response = await fetch(`${GHL_API_URL}/opportunities`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            contactId,
            pipelineId,
            stageId,
            name,
            monetaryValue,
            status,
            locationId: GHL_LOCATION_ID,
          }),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          opportunity: data.opportunity || data,
        });
      }

      case "send_message": {
        const { contactId, type = "SMS", message } = params;

        const response = await fetch(`${GHL_API_URL}/conversations/messages`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            contactId,
            type, // SMS or Email
            message,
            locationId: GHL_LOCATION_ID,
          }),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          messageId: data.messageId,
          message: response.ok ? "Message sent successfully" : "Failed to send message",
        });
      }

      case "add_tag": {
        const { contactId, tags } = params;

        const response = await fetch(`${GHL_API_URL}/contacts/${contactId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            tags,
          }),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          contact: data.contact || data,
        });
      }

      case "create_appointment": {
        const { calendarId, contactId, startTime, endTime, title, address } = params;

        const response = await fetch(`${GHL_API_URL}/appointments`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            calendarId,
            contactId,
            startTime,
            endTime,
            title,
            address,
            locationId: GHL_LOCATION_ID,
          }),
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          appointment: data.appointment || data,
        });
      }

      case "list_pipelines": {
        const response = await fetch(`${GHL_API_URL}/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`, {
          headers,
        });

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          pipelines: data.pipelines || [],
        });
      }

      default:
        return NextResponse.json({
          error: "Invalid action. Available: create_contact, get_contact, create_opportunity, send_message, add_tag, create_appointment, list_pipelines",
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error("GoHighLevel API error:", error);
    return NextResponse.json({
      error: error.message || "GoHighLevel integration failed",
    }, { status: 500 });
  }
}
