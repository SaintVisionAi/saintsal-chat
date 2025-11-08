/**
 * app/api/files/upload/route.ts
 * File upload handler - PDFs, images, documents
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";
import OpenAI from "openai";
import { MongoClient, ObjectId } from "mongodb";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION (use secure session)
    const { getSession } = await import('../../../../lib/session');
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    if (!session.userId || !session.email) {
      console.log('❌ [FILE-UPLOAD] No session - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [FILE-UPLOAD] User authenticated: ${session.userId}`);

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileType = file.type;
    const fileSize = file.size;

    // Size limit: 10MB
    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    let extractedText = "";
    let fileUrl = "";

    // Handle different file types
    if (fileType === "application/pdf") {
      // For PDFs, we'd normally use a PDF parser
      // For now, save metadata
      extractedText = `PDF file: ${fileName}`;
    } else if (fileType.startsWith("image/")) {
      // For images, we could use vision API
      extractedText = `Image file: ${fileName}`;

      // Optional: Use OpenAI Vision to analyze
      try {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${fileType};base64,${base64}`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Describe this image in detail.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: dataUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        });

        extractedText = response.choices[0]?.message?.content || extractedText;
      } catch (visionError) {
        console.error("Vision API error:", visionError);
      }
    } else if (
      fileType === "text/plain" ||
      fileType === "text/csv" ||
      fileType === "application/json"
    ) {
      // Extract text directly
      const text = await file.text();
      extractedText = text.substring(0, 5000); // Limit to 5000 chars
    } else {
      extractedText = `File uploaded: ${fileName}`;
    }

    // Save to MongoDB
    const db = await getDb();
    const files = db.collection("files");
    const documents = db.collection("documents");

    const result = await files.insertOne({
      userId: session.userId,
      fileName,
      fileType,
      fileSize,
      extractedText,
      uploadedAt: new Date(),
    });

    // 🔥 STORE IN RAG DOCUMENTS COLLECTION FOR MEMORY/RESEARCH
    if (extractedText && extractedText.length > 50) {
      try {
        console.log('📚 [RAG] Creating embedding for uploaded document...');
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: extractedText.substring(0, 8000), // Limit to 8000 chars for embedding
        });

        const embedding = embeddingResponse.data[0].embedding;
        console.log(`✅ [RAG] Embedding created (${embedding.length} dimensions)`);

        // Store document with embedding for RAG search
        await documents.insertOne({
          userId: new ObjectId(session.userId),
          content: extractedText,
          embedding: embedding,
          metadata: {
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            source: 'file_upload',
            uploadedAt: new Date(),
          },
          createdAt: new Date(),
        });
        console.log('✅ [RAG] Document stored in RAG collection for future retrieval');
      } catch (ragError) {
        console.error('❌ [RAG] Failed to store document in RAG:', ragError);
        // Don't fail file upload if RAG storage fails
      }
    }

    return NextResponse.json({
      success: true,
      fileId: result.insertedId,
      fileName,
      fileType,
      extractedText,
      message: "File uploaded successfully",
    });
  } catch (err: any) {
    console.error("File upload error:", err);
    return NextResponse.json(
      { error: "File upload failed: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}

// Get user's files
export async function GET(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION (use secure session)
    const { getSession } = await import('../../../../lib/session');
    const res = new NextResponse();
    const session = await getSession(req, res);
    
    if (!session.userId || !session.email) {
      console.log('❌ [FILE-GET] No session - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [FILE-GET] User authenticated: ${session.userId}`);

    const db = await getDb();
    const files = db.collection("files");

    const userFiles = await files
      .find({ userId: session.userId })
      .sort({ uploadedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      files: userFiles,
    });
  } catch (err: any) {
    console.error("Get files error:", err);
    return NextResponse.json(
      { error: "Failed to get files: " + (err?.message ?? String(err)) },
      { status: 500 }
    );
  }
}
