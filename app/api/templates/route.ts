/**
 * app/api/templates/route.ts
 * Prompt Templates Library - Pre-built and custom templates
 */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// System templates provided by SaintSal™
const SYSTEM_TEMPLATES = [
  {
    id: "code-review",
    name: "Code Review Expert",
    category: "Development",
    icon: "🔍",
    prompt: "You are an expert code reviewer. Review the following code for:\n- Best practices\n- Performance issues\n- Security vulnerabilities\n- Code style and readability\n\nProvide specific, actionable feedback.",
    isSystem: true,
  },
  {
    id: "explain-code",
    name: "Code Explainer",
    category: "Development",
    icon: "💡",
    prompt: "You are a code explainer. Break down the following code into simple terms:\n- What it does\n- How it works\n- Key concepts used\n- Potential improvements\n\nExplain like I'm a beginner.",
    isSystem: true,
  },
  {
    id: "debug-helper",
    name: "Debug Assistant",
    category: "Development",
    icon: "🐛",
    prompt: "You are a debugging expert. Help me identify and fix issues in my code:\n- Analyze error messages\n- Suggest potential causes\n- Provide step-by-step solutions\n- Explain how to prevent similar issues",
    isSystem: true,
  },
  {
    id: "api-designer",
    name: "API Designer",
    category: "Development",
    icon: "🔌",
    prompt: "You are an API design expert. Help me design a robust REST API:\n- RESTful principles\n- Proper HTTP methods\n- Authentication & security\n- Error handling\n- Documentation standards",
    isSystem: true,
  },
  {
    id: "content-writer",
    name: "Content Writer",
    category: "Writing",
    icon: "✍️",
    prompt: "You are a professional content writer. Help me create engaging content:\n- Clear and compelling\n- SEO-optimized\n- Audience-focused\n- Proper formatting\n- Call-to-action included",
    isSystem: true,
  },
  {
    id: "marketing-expert",
    name: "Marketing Strategist",
    category: "Marketing",
    icon: "📈",
    prompt: "You are a marketing strategist. Help me develop effective marketing strategies:\n- Target audience analysis\n- Unique value propositions\n- Channel recommendations\n- Campaign ideas\n- Metrics to track",
    isSystem: true,
  },
  {
    id: "business-analyst",
    name: "Business Analyst",
    category: "Business",
    icon: "💼",
    prompt: "You are a business analyst. Help me analyze business challenges:\n- SWOT analysis\n- Market research\n- Competitive analysis\n- Growth opportunities\n- Risk assessment",
    isSystem: true,
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    category: "Data",
    icon: "📊",
    prompt: "You are a data scientist. Help me with data analysis:\n- Statistical insights\n- Pattern recognition\n- Predictive modeling\n- Data visualization\n- Actionable recommendations",
    isSystem: true,
  },
  {
    id: "tutor",
    name: "Learning Tutor",
    category: "Education",
    icon: "🎓",
    prompt: "You are an expert tutor. Help me learn new concepts:\n- Break down complex topics\n- Use analogies and examples\n- Check understanding with questions\n- Provide practice problems\n- Encourage active learning",
    isSystem: true,
  },
  {
    id: "creative-writer",
    name: "Creative Writer",
    category: "Writing",
    icon: "🎨",
    prompt: "You are a creative writer. Help me craft compelling stories:\n- Engaging narratives\n- Vivid descriptions\n- Character development\n- Plot structure\n- Emotional resonance",
    isSystem: true,
  },
];

// GET all templates (system + user custom)
export async function GET(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const userId = authCookieMatch ? authCookieMatch[1] : null;

    if (!userId) {
      console.log('❌ [TEMPLATES] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [TEMPLATES] User authenticated: ${userId}`);

    const { searchParams } = new URL(req.url);

    // Always return system templates
    let allTemplates = [...SYSTEM_TEMPLATES];

    // Fetch custom templates for authenticated user
    const db = await getDb();
    const templates = db.collection("prompt_templates");
    const customTemplates = await templates.find({ userId }).toArray();

    allTemplates = [
      ...SYSTEM_TEMPLATES,
      ...customTemplates.map((t) => ({
        id: t._id.toString(),
        name: t.name,
        category: t.category,
        icon: t.icon,
        prompt: t.prompt,
        isSystem: false,
        createdAt: t.createdAt,
      })),
    ];

    return NextResponse.json({
      success: true,
      templates: allTemplates,
      systemCount: SYSTEM_TEMPLATES.length,
      customCount: allTemplates.length - SYSTEM_TEMPLATES.length,
    });
  } catch (err: any) {
    console.error("Get templates error:", err);
    return NextResponse.json({ error: "Failed to get templates: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}

// POST create custom template
export async function POST(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const userId = authCookieMatch ? authCookieMatch[1] : null;

    if (!userId) {
      console.log('❌ [TEMPLATES-CREATE] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [TEMPLATES-CREATE] User authenticated: ${userId}`);

    const { name, category, icon, prompt } = await req.json();

    if (!name || !prompt) {
      return NextResponse.json({ error: "name and prompt are required" }, { status: 400 });
    }

    const db = await getDb();
    const templates = db.collection("prompt_templates");

    const result = await templates.insertOne({
      userId,
      name,
      category: category || "Custom",
      icon: icon || "⭐",
      prompt,
      isSystem: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      templateId: result.insertedId.toString(),
      message: "Template created successfully",
    });
  } catch (err: any) {
    console.error("Create template error:", err);
    return NextResponse.json({ error: "Failed to create template: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}

// DELETE custom template
export async function DELETE(req: Request) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const userId = authCookieMatch ? authCookieMatch[1] : null;

    if (!userId) {
      console.log('❌ [TEMPLATES-DELETE] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [TEMPLATES-DELETE] User authenticated: ${userId}`);

    const { searchParams } = new URL(req.url);
    const templateId = searchParams.get("templateId");

    if (!templateId) {
      return NextResponse.json({ error: "templateId is required" }, { status: 400 });
    }

    const db = await getDb();
    const templates = db.collection("prompt_templates");

    // Make sure user owns this template
    const result = await templates.deleteOne({
      _id: new (require("mongodb").ObjectId)(templateId),
      userId,
      isSystem: { $ne: true }, // Prevent deleting system templates
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Template not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (err: any) {
    console.error("Delete template error:", err);
    return NextResponse.json({ error: "Failed to delete template: " + (err?.message ?? String(err)) }, { status: 500 });
  }
}
