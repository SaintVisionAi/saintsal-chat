/**
 * app/api/admin/dashboard/route.ts
 * Admin Dashboard - Real-time Metrics & Analytics
 */
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

// Verify admin session
function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("saintsal_admin_session");
  return session?.value === "admin-authenticated";
}

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");

    // Parallel queries for dashboard metrics
    const [
      totalUsers,
      totalMessages,
      totalDocuments,
      usersList,
      recentMessages,
      subscriptionStats,
      featureUsage,
    ] = await Promise.all([
      // Total users count
      db.collection("users").countDocuments(),

      // Total messages count
      db.collection("messages").countDocuments(),

      // Total documents (RAG knowledge base)
      db.collection("documents").countDocuments(),

      // Users list with subscription info
      db.collection("users")
        .find({})
        .project({ password: 0 }) // Exclude passwords
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),

      // Recent messages (last 24 hours)
      db.collection("messages")
        .find({
          timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray(),

      // Subscription tier distribution
      db.collection("users")
        .aggregate([
          {
            $group: {
              _id: "$plan",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),

      // Feature usage stats (messages per user)
      db.collection("messages")
        .aggregate([
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
    ]);

    // Calculate token usage estimate (rough calculation)
    const estimatedTokens = totalMessages * 500; // Average 500 tokens per message
    const estimatedCost = (estimatedTokens / 1000) * 0.002; // $0.002 per 1K tokens

    // Format subscription stats
    const subscriptions = {
      free: subscriptionStats.find((s) => s._id === "free")?.count || 0,
      pro: subscriptionStats.find((s) => s._id === "pro")?.count || 0,
      enterprise: subscriptionStats.find((s) => s._id === "enterprise")?.count || 0,
    };

    // Format feature usage
    const usage = {
      userMessages: featureUsage.find((f) => f._id === "user")?.count || 0,
      assistantMessages: featureUsage.find((f) => f._id === "assistant")?.count || 0,
    };

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        totalMessages,
        totalDocuments,
        estimatedTokens,
        estimatedCost: estimatedCost.toFixed(2),
      },
      subscriptions,
      featureUsage: usage,
      users: usersList,
      recentActivity: recentMessages,
      timestamp: new Date(),
    });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
