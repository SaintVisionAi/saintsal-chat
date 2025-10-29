# MongoDB Vector Search Index Setup

This script automatically creates the vector search index needed for RAG (Retrieval-Augmented Generation) functionality.

## Quick Start

```bash
npm run setup-vector-index
```

## What It Does

The script will:
1. ✅ Connect to your MongoDB Atlas cluster
2. ✅ Check if the `documents` collection exists (creates it if needed)
3. ✅ Create a vector search index named `vector_index`
4. ✅ Configure it for 1536-dimensional embeddings (OpenAI text-embedding-3-small)
5. ✅ Set cosine similarity for optimal RAG performance

## Requirements

- `.env.local` file with `MONGODB_URI` set
- MongoDB Atlas cluster (M10 or higher for vector search)
- Network access to MongoDB (IP whitelisted)

## Expected Output

```
🚀 Starting MongoDB Vector Search Index setup...

📊 Connecting to MongoDB Atlas...
✅ Connected to MongoDB

📁 Database: saintsal_db
📄 Collection: documents

🔍 Creating vector search index...
Index name: vector_index
Vector field: embedding
Dimensions: 1536 (OpenAI text-embedding-3-small)
Similarity: cosine

✅ Vector search index created successfully!

🎉 Setup complete! Your RAG functionality is ready to use.

ℹ️  Note: It may take a few minutes for the index to become active in MongoDB Atlas.
   You can check the status in the MongoDB Atlas UI under Search Indexes.

📊 Disconnected from MongoDB
```

## Troubleshooting

### "MONGODB_URI not found"
- Make sure you have a `.env.local` file in the project root
- Verify `MONGODB_URI` is set correctly

### "Connection refused" / "Network error"
- Check your MongoDB cluster is running
- Verify your IP address is whitelisted in MongoDB Atlas Network Access
- Ensure your connection string is correct

### "Index already exists"
- This is OK! The script will detect it and skip creation
- Your RAG functionality is already set up

### "Permission denied to create search indexes"
- Verify your MongoDB user has `atlasAdmin` or `readWrite` permissions
- Check that you're using an M10+ cluster (vector search requires paid tier)

## Manual Setup (Alternative)

If the script doesn't work, you can create the index manually:

1. Go to MongoDB Atlas → Database → Browse Collections
2. Select `saintsal_db` → `documents` collection
3. Click "Search Indexes" tab
4. Click "Create Search Index"
5. Choose "JSON Editor"
6. Paste this configuration:

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    }
  ]
}
```

7. Click "Create"

## Verifying the Index

After creating the index:

1. Go to MongoDB Atlas → Search Indexes
2. Check that `vector_index` shows status: **Active**
3. If status is "Building", wait a few minutes for it to complete

## Testing RAG

Once the index is active, test RAG functionality:

1. Upload a document or add text to the `documents` collection
2. Make sure each document has an `embedding` field (1536-dimensional array)
3. Send a chat message
4. Check Vercel logs for RAG execution:
   ```
   🔍 [RAG] Starting vector search...
   ✅ [RAG] Found 3 relevant documents
   ```

## Need Help?

If you encounter issues:
1. Check the MongoDB Atlas UI for index status
2. Review Vercel logs for RAG errors
3. Ensure documents have embeddings
4. Verify your tier supports vector search (M10+)
