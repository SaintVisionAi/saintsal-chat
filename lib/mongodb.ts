/**
 * lib/mongodb.ts
 * Simple MongoDB singleton connection for Next.js (ESM-safe)
 */
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "saintsal_db";

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // @ts-ignore - allow attaching to global in dev for hot reload
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // Reuse client across hot reloads to avoid too many connections
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise!;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const c = await clientPromise;
  return c.db(dbName);
}
