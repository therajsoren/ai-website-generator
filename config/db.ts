import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL environment variable. Make sure your .env is loaded or set in the environment."
  );
}

export const db = drizzle(DATABASE_URL);
