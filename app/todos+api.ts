import { todos } from "@/db/schema";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { desc } from 'drizzle-orm';

export async function GET(request: Request) {
    const user_todos = await db.select().from(todos).orderBy(desc(todos.updated_at));
    return Response.json(user_todos);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    await db.delete(todos).where(eq(todos.id, id));
    return Response.json({ id });
}

export async function POST(request: Request) {
    const { title, completed, user_id } = await request.json();
    const new_todo = await db.insert(todos).values({ title, completed, user_id });
    return Response.json(new_todo);
}

export async function PUT(request: Request) {
    const { id, title } = await request.json();
    await db.update(todos).set({ title }).where(eq(todos.id, id));
    return Response.json({ id });
}