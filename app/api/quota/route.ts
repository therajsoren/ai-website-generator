import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getUserQuota } from "@/lib/queries";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as number;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quota = await getUserQuota(userId);
    return NextResponse.json({ quota });
  } catch (error) {
    console.error("Get quota error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quota" },
      { status: 500 }
    );
  }
}
