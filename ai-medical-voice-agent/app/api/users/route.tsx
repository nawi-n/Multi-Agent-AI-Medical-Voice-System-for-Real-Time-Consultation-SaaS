import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await currentUser();
  try {
    const users = await db
      .select()
      .from(usersTable)
      // @ts-expect-error - email type mismatch handled by DB
      .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

    if (users?.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user?.fullName || "No Name",
          email: user?.primaryEmailAddress?.emailAddress || "No Email",
          credits: 10,
        })
        // @ts-expect-error - returning type from DB insert
        .returning({ usersTable });
      return NextResponse.json(result[0]?.usersTable);
    }
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json(e);
  }
}
