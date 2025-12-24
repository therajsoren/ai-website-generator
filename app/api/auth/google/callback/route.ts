import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        new URL("/login?error=google_auth_failed", request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=no_code", request.url)
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ).replace(/\/$/, "");
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL("/login?error=not_configured", request.url)
      );
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Token exchange error:", tokenData);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange", request.url)
      );
    }

    // Get user info
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const userData = await userRes.json();

    if (!userRes.ok) {
      return NextResponse.redirect(
        new URL("/login?error=user_info", request.url)
      );
    }

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email));

    if (!user) {
      // Create new user
      [user] = await db
        .insert(users)
        .values({
          name: userData.name || userData.email.split("@")[0],
          email: userData.email,
          avatarUrl: userData.picture,
        })
        .returning();
    }

    // Create JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }
    const secret = new TextEncoder().encode(jwtSecret);

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    // Redirect to dashboard with cookie
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Google callback error:", message);
    return NextResponse.redirect(
      new URL(
        `/login?error=callback_error&details=${encodeURIComponent(message)}`,
        request.url
      )
    );
  }
}
