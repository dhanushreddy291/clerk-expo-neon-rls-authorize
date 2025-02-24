import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import { todos } from "./db/schema";
import 'dotenv/config';

async function main() {
    const db = drizzle(process.env.DATABASE_URL!);
    await seed(db, { todos });
}

main();
