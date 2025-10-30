/**
 * app/api/chat/route.ts
 * Production-Grade Streaming Chat API with RAG + MongoDB
 * SaintSal™ - IQ 157 Intelligence Platform
 */
import { NextRequest } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { MongoClient, ObjectId } from "mongodb";
import { checkUserLimit, incrementUsage } from "../../../lib/mongodb-schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const mongoUri = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(req: NextRequest) {
  console.log('💬 [CHAT] Starting chat request...');

  try {
    const { message, model = "gpt-4o-mini", stream = true } = await req.json();

    if (!message) {
      console.log('❌ [CHAT] No message provided');
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    console.log(`📝 [CHAT] Message received (${message.length} chars)`);

    // 🔐 CHECK USER AUTHENTICATION (check both cookie names)
    const authCookie = req.cookies.get('saintsal_auth')?.value || req.cookies.get('saintsal_session')?.value;
    if (!authCookie) {
      console.log('❌ [CHAT] No auth cookie - user not authenticated');
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    console.log(`🔐 [CHAT] User ID: ${authCookie}`);

    // 📧 CHECK EMAIL VERIFICATION
    const client = await getMongoClient();
    const db = client.db("saintsal_db");
    const users = db.collection("users");

    const { ObjectId } = require('mongodb');
    const user = await users.findOne({ _id: new ObjectId(authCookie) });

    if (!user) {
      console.log('❌ [CHAT] User not found');
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!user.emailVerified) {
      console.log('❌ [CHAT] Email not verified');
      return new Response(
        JSON.stringify({
          error: "Email verification required",
          message: "Please verify your email address before using chat. Check your inbox for the verification link.",
          emailVerificationRequired: true
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    console.log('✅ [CHAT] Email verified');

    // 📊 CHECK MESSAGE LIMIT
    console.log('📊 [CHAT] Checking message limit...');
    const hasMessageLimit = await checkUserLimit(authCookie, 'messages');
    if (!hasMessageLimit) {
      console.log('❌ [CHAT] Message limit exceeded!');
      return new Response(
        JSON.stringify({
          error: "Message limit exceeded",
          limitType: "messages",
          message: "You've reached your monthly message limit. Please upgrade your plan."
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    console.log('✅ [CHAT] Message limit OK');

    const messagesCol = db.collection("messages");
    const documentsCol = db.collection("documents");

    // Store user message
    console.log('💾 [CHAT] Storing user message in MongoDB...');
    await messagesCol.insertOne({
      userId: new ObjectId(authCookie),
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    console.log('✅ [CHAT] User message stored');

    // 🔥 MONGODB VECTOR SEARCH FOR RAG
    let ragContext = "";
    let ragUsed = false;

    console.log('🔍 [RAG] Starting vector search...');
    try {
      // Check RAG limit
      const hasRagLimit = await checkUserLimit(authCookie, 'rag');
      if (!hasRagLimit) {
        console.log('⚠️ [RAG] RAG query limit exceeded - skipping RAG');
      } else {
        console.log('📊 [RAG] Creating embedding for query...');
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: message,
        });

        const queryEmbedding = embeddingResponse.data[0].embedding;
        console.log(`✅ [RAG] Embedding created (${queryEmbedding.length} dimensions)`);

        console.log('🔎 [RAG] Executing vector search...');
        const vectorSearchResults = await documentsCol.aggregate([
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: queryEmbedding,
              numCandidates: 150,
              limit: 5
            }
          },
          {
            $project: {
              _id: 0,
              content: 1,
              metadata: 1,
              score: { $meta: "vectorSearchScore" }
            }
          }
        ]).toArray();

        if (vectorSearchResults.length > 0) {
          ragContext = "\n\nRelevant Knowledge:\n" +
            vectorSearchResults
              .map((doc: any, idx: number) =>
                `[${idx + 1}] ${doc.content} (relevance: ${doc.score.toFixed(3)})`
              )
              .join("\n");
          ragUsed = true;

          console.log(`✅ [RAG] Found ${vectorSearchResults.length} relevant documents`);
          vectorSearchResults.forEach((doc: any, idx: number) => {
            console.log(`   📄 [RAG] Doc ${idx + 1}: Score ${doc.score.toFixed(3)}`);
          });

          // Increment RAG usage
          await incrementUsage(authCookie, 'rag', 1);
          console.log('✅ [RAG] RAG usage incremented');
        } else {
          console.log('⚠️ [RAG] No relevant documents found');
        }
      }
    } catch (ragError) {
      console.error("❌ [RAG] Vector search error:", ragError);
    }

    const systemPrompt = `You are SaintSal™ - the AI embodiment of Sal Couzzo's intellectual legacy.
IQ 157. Former Goldman Sachs executive track. You operate at the apex of human intelligence across
finance, real estate, law, technology, healthcare, and government/defense.

You are not an assistant - you are THE definitive intelligence platform. Whatever the problem,
you HAVE the answer. Whatever the need, you DELIVER the solution. Whatever the complexity, you EXECUTE.

${ragContext}

Respond with absolute precision, strategic insight, and tactical execution. No corporate speak.
Direct, powerful, authentic communication.`;

    console.log(`🤖 [CHAT] Using model: ${model}`);
    console.log(`🌊 [CHAT] Streaming: ${stream ? 'YES' : 'NO'}`);

    // 🔥 STREAMING WITH SERVER-SENT EVENTS
    if (stream) {
      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          let fullResponse = "";

          try {
            console.log('🚀 [CHAT] Starting OpenAI streaming...');
            // Try OpenAI streaming first
            const completion = await openai.chat.completions.create({
              model: model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message },
              ],
              temperature: 0.7,
              max_tokens: 2000,
              stream: true, // ⚡ ENABLE STREAMING
            });

            // Stream tokens as they arrive
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content || "";

              if (content) {
                fullResponse += content;

                // Send SSE event
                const data = JSON.stringify({
                  token: content,
                  done: false
                });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }

            // Send completion event
            const doneData = JSON.stringify({
              token: "",
              done: true,
              model: model,
              ragUsed: ragUsed
            });
            controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

            console.log(`✅ [CHAT] OpenAI streaming complete (${fullResponse.length} chars)`);

            // Store assistant response
            console.log('💾 [CHAT] Storing assistant response...');
            await messagesCol.insertOne({
              userId: new ObjectId(authCookie),
              role: "assistant",
              content: fullResponse,
              model: model,
              ragUsed: ragUsed,
              timestamp: new Date(),
            });
            console.log('✅ [CHAT] Assistant response stored');

            // Increment message usage
            await incrementUsage(authCookie, 'messages', 1);
            console.log('✅ [CHAT] Message usage incremented');

          } catch (openaiError) {
            console.error("❌ [CHAT] OpenAI streaming error:", openaiError);
            console.log('🔄 [CHAT] Falling back to Claude...');

            // Fallback to Claude streaming
            try {
              const claudeStream = await anthropic.messages.stream({
                model: "claude-sonnet-4-20250514",
                max_tokens: 2000,
                messages: [
                  { role: "user", content: message }
                ],
                system: systemPrompt,
              });

              for await (const chunk of claudeStream) {
                if (chunk.type === 'content_block_delta' &&
                    chunk.delta.type === 'text_delta') {
                  const content = chunk.delta.text;
                  fullResponse += content;

                  const data = JSON.stringify({
                    token: content,
                    done: false
                  });
                  controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                }
              }

              const doneData = JSON.stringify({
                token: "",
                done: true,
                model: "claude-sonnet-4",
                ragUsed: ragUsed
              });
              controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

              console.log(`✅ [CHAT] Claude streaming complete (${fullResponse.length} chars)`);

              console.log('💾 [CHAT] Storing assistant response...');
              await messagesCol.insertOne({
                userId: new ObjectId(authCookie),
                role: "assistant",
                content: fullResponse,
                model: "claude-sonnet-4",
                ragUsed: ragUsed,
                timestamp: new Date(),
              });
              console.log('✅ [CHAT] Assistant response stored');

              // Increment message usage
              await incrementUsage(authCookie, 'messages', 1);
              console.log('✅ [CHAT] Message usage incremented');

            } catch (claudeError) {
              console.error("❌ [CHAT] Claude streaming error:", claudeError);

              const errorData = JSON.stringify({
                error: "SaintSal is temporarily unavailable",
                done: true
              });
              controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            }
          }

          console.log('🎉 [CHAT] Stream complete, closing controller');
          controller.close();
        }
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming fallback (if stream=false)
    console.log('📝 [CHAT] Non-streaming mode...');
    let assistantText = "SaintSal is thinking...";

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      assistantText = completion?.choices?.[0]?.message?.content ?? assistantText;
      console.log(`✅ [CHAT] Response generated (${assistantText.length} chars)`);
    } catch (err) {
      console.error("❌ [CHAT] OpenAI error:", err);
      assistantText = "SaintSal is temporarily unavailable.";
    }

    console.log('💾 [CHAT] Storing assistant response...');
    await messagesCol.insertOne({
      userId: new ObjectId(authCookie),
      role: "assistant",
      content: assistantText,
      model: model,
      ragUsed: ragUsed,
      timestamp: new Date(),
    });
    console.log('✅ [CHAT] Assistant response stored');

    // Increment message usage
    await incrementUsage(authCookie, 'messages', 1);
    console.log('✅ [CHAT] Message usage incremented');

    console.log('🎉 [CHAT] Non-streaming chat complete');
    return new Response(
      JSON.stringify({
        response: assistantText,
        model: model,
        ragUsed: ragUsed,
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("❌ [CHAT] API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

