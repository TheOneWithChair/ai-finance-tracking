const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
    console.error("DATABASE_URL is not set in environment variables");
    process.exit(1);
  }

  try {
    console.log("Attempting to connect to database...");
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const db = drizzle(sql);
    
    // Test the connection with a simple query
    const result = await sql`SELECT NOW();`;
    console.log("✅ Database connection successful!");
    console.log("Current database time:", result[0].now);
    
    // Test if we can query our schema
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `;
      console.log("\nAvailable tables in database:");
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    } catch (error) {
      console.log("Could not fetch table list:", error.message);
    }

  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection(); 