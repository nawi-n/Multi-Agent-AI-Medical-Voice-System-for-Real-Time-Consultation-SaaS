import { sessionChatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { uuid } from "drizzle-orm/gel-core";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();
  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(sessionChatTable)
      .values({
        //@ts-ignore
        sessionId: sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
      }) //@ts-ignore
      .returning({ sessionChatTable });
    return NextResponse.json(result[0].sessionChatTable);
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId") || "";
  const user = await currentUser();

  if (sessionId === "all") {
    const results = await db
      .select()
      .from(sessionChatTable)
      .where(
        //@ts-ignore
        eq(sessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress)
      )
      .orderBy(desc(sessionChatTable.id));

    return NextResponse.json(results);
  }

  const result = await db
    .select()
    .from(sessionChatTable)
    .where(eq(sessionChatTable.sessionId, sessionId));

  return NextResponse.json(result[0]);
}
