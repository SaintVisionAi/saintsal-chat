import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_vd6fJ9ElVWOa@ep-nameless-dawn-adefmy7s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function dropTables() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🗑️  Dropping old tables...');
    
    await client.query('DROP TABLE IF EXISTS messages CASCADE;');
    await client.query('DROP TABLE IF EXISTS conversations CASCADE;');
    await client.query('DROP TABLE IF EXISTS user_context CASCADE;');
    await client.query('DROP TABLE IF EXISTS sal_knowledge CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    
    console.log('✅ Old tables dropped!');
    console.log('\n💡 Now run: node setup_neon_database.js');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

dropTables();
