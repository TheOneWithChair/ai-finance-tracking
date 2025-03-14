import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  driver: "pg",
  dialect: "pg",
  dbCredentials: {
    connectionString: process.env.NEXT_PUBLIC_DATABASE_URL || process.env.DATABASE_URL,
  },
};
