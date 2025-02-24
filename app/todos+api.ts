import { todosTable } from "@/db/schema";
import { db } from "@/db/drizzle";

export async function GET(request: Request) {
    const todos = await db.select().from(todosTable);
    return Response.json(todos);
}
