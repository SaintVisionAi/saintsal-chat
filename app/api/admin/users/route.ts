/**
 * app/api/admin/users/route.ts
 * Admin User Management - Add/Edit/Delete Users
 */
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

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

// GET - List all users
export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const users = db.collection("users");

    const usersList = await users
      .find({})
      .project({ password: 0 }) // Exclude passwords
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, users: usersList });
  } catch (error: any) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST - Create new user (Admin must provide all fields + user must verify email)
export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, phone, plan, companyName, role } = await req.json();

    // Require all essential fields
    if (!name || !email || !password || !phone) {
      return NextResponse.json({
        error: "Name, email, password, and phone number are required"
      }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const users = db.collection("users");

    // Check if user already exists
    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user (emailVerified = false)
    const result = await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      plan: plan || "free",
      companyName: companyName || "",
      role: role || "user",
      emailVerified: false,
      verificationToken,
      verificationExpires,
      createdAt: new Date(),
      lastLogin: null,
      usage: {
        messages: 0,
        lastReset: new Date()
      }
    });

    console.log(`✅ [ADMIN] Created user: ${email} (ID: ${result.insertedId})`);

    // Send verification email
    try {
      await sendVerificationEmail(email.toLowerCase(), verificationToken);
      console.log(`📧 [ADMIN] Verification email sent to: ${email}`);
    } catch (emailError) {
      console.error('❌ [ADMIN] Failed to send verification email:', emailError);
      // Don't fail user creation if email fails - admin can resend
    }

    return NextResponse.json({
      success: true,
      userId: result.insertedId.toString(),
      message: "User created successfully. Verification email sent.",
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PATCH - Update user
export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, name, email, plan, companyName, role, password } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const users = db.collection("users");

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (plan) updateData.plan = plan;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (role) updateData.role = role;

    // If password is provided, hash it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    updateData.updatedAt = new Date();

    const result = await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "saintsal_db");
    const users = db.collection("users");

    const result = await users.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
