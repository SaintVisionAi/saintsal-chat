import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_vd6fJ9ElVWOa@ep-nameless-dawn-adefmy7s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function setupDatabase() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🚀 Connected to Neon!');
    
    // Create users table with BIGINT for clerk_id
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id BIGINT UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create user_context table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_context (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        context_key VARCHAR(255) NOT NULL,
        context_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, context_key)
      );
    `);
    
    // Create sal_knowledge table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sal_knowledge (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        topic VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ All tables created successfully!');
    console.log('\n📊 Tables:');
    console.log('  - users (with BIGINT clerk_id)');
    console.log('  - conversations');
    console.log('  - messages');
    console.log('  - user_context');
    console.log('  - sal_knowledge');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

setupDatabase();
