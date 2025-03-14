import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

let sql;
try {
  sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
  console.log("Neon SQL connection initialized");
} catch (error) {
  console.error("Failed to initialize Neon SQL connection:", error);
  throw error;
}

export const db = drizzle(sql, { schema });

// Verify connection
const verifyConnection = async () => {
  try {
    // Simple query to test connection
    const result = await sql`SELECT NOW();`;
    console.log("Database connection verified:", result);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

// Export the verification function
export { verifyConnection };
