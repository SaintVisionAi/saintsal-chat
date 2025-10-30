/**
 * app/api/admin/packages/route.ts
 * Admin Package/Tier Management
 */
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const mongoUri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

function isAdmin(req: NextRequest): boolean {
  const session = req.cookies.get("saintsal_admin_session");
  return session?.value === "admin-authenticated";
}

// GET - List all packages
export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const packages = db.collection("packages");

    const packagesList = await packages.find({}).sort({ price: 1 }).toArray();

    // If no packages exist, return default structure
    if (packagesList.length === 0) {
      return NextResponse.json({
        success: true,
        packages: [
          {
            _id: "free",
            name: "Free",
            price: 0,
            features: ["Basic chat", "1,000 messages/month", "Standard support"],
            limits: { messages: 1000, tokens: 500000 },
          },
          {
            _id: "pro",
            name: "Pro",
            price: 29,
            features: [
              "Unlimited chat",
              "Voice features",
              "Priority support",
              "Code generation",
              "File uploads",
            ],
            limits: { messages: -1, tokens: 5000000 },
          },
          {
            _id: "enterprise",
            name: "Enterprise",
            price: 199,
            features: [
              "Everything in Pro",
              "Dedicated support",
              "Custom integrations",
              "SLA guarantees",
              "Team management",
            ],
            limits: { messages: -1, tokens: -1 },
          },
        ],
      });
    }

    return NextResponse.json({ success: true, packages: packagesList });
  } catch (error: any) {
    console.error("Get packages error:", error);
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

// POST - Create new package
export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, price, features, limits } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const packages = db.collection("packages");

    const result = await packages.insertOne({
      name,
      price: parseFloat(price),
      features: features || [],
      limits: limits || { messages: -1, tokens: -1 },
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      packageId: result.insertedId.toString(),
      message: "Package created successfully",
    });
  } catch (error: any) {
    console.error("Create package error:", error);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}

// PATCH - Update package
export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId, name, price, features, limits } = await req.json();

    if (!packageId) {
      return NextResponse.json({ error: "packageId is required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const packages = db.collection("packages");

    const updateData: any = {};

    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (features) updateData.features = features;
    if (limits) updateData.limits = limits;

    updateData.updatedAt = new Date();

    const result = await packages.updateOne(
      { _id: new ObjectId(packageId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Package updated successfully",
    });
  } catch (error: any) {
    console.error("Update package error:", error);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

// DELETE - Delete package
export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("packageId");

    if (!packageId) {
      return NextResponse.json({ error: "packageId is required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const packages = db.collection("packages");

    const result = await packages.deleteOne({ _id: new ObjectId(packageId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete package error:", error);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
