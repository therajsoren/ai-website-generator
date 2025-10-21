import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress!));

  if (userResult?.length == 0) {
    const data = {
      email: user?.primaryEmailAddress?.emailAddress ?? "NA",
      name: user?.fullName ?? "NA",
      credits: 2,
    };
    const result = await db.insert(usersTable).values({
      email: user?.primaryEmailAddress?.emailAddress ?? "NA",
      name: user?.fullName ?? "NA",
    });
    return NextResponse.json({ user: data });
  }
  return NextResponse.json({ user: userResult[0] });
}
