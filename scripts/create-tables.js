const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function createTables() {
  const client = new Client({
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL || process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../drizzle/0000_initial.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Creating tables...');
    await client.query(sql);
    
    console.log('Tables created successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nCreated tables:');
    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createTables(); 