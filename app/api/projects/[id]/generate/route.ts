import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  getProjectById,
  createFrame,
  getUserById,
  incrementQuotaUsage,
} from "@/lib/queries";
import { nanoid } from "nanoid";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id: projectId } = await params;
    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const quotaResult = await incrementQuotaUsage(userId);
    if (!quotaResult.success) {
      return NextResponse.json(
        {
          error: "Daily quota exceeded. Resets at midnight.",
          quota: quotaResult.quota,
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an expert web developer. Generate a complete, modern, responsive website based on the user's description.

IMPORTANT: You must return the code in a specific JSON format with separate files for HTML, CSS, and JavaScript.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "html": "<!DOCTYPE html>...",
  "css": "/* CSS styles */...",
  "js": "// JavaScript code..."
}

Rules for the code:
1. HTML file should link to styles.css and script.js using relative paths
2. Use <link rel="stylesheet" href="styles.css"> in the head
3. Use <script src="script.js" defer></script> before closing body tag
4. CSS should be modern with flexbox, grid, custom properties, gradients
5. Make it fully responsive with media queries
6. Use premium, professional design with smooth animations
7. JavaScript should handle interactivity (menu toggles, scroll effects, etc.)
8. Include proper meta tags and semantic HTML
9. Add realistic placeholder content
10. Make it visually impressive and modern

User request: ${prompt}`;

    console.log("Calling Gemini API for structured output...");

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let responseText = response.text();

    console.log("Gemini response received, parsing...");

    responseText = responseText
      .replace(/```json\n?/gi, "")
      .replace(/```\n?/g, "")
      .trim();

    let files;
    try {
      files = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      files = {
        html: responseText,
        css: "",
        js: "",
      };
    }

    const code = JSON.stringify({
      html:
        files.html ||
        "<!DOCTYPE html><html><head><title>Website</title><link rel='stylesheet' href='styles.css'></head><body><h1>Generated Website</h1><script src='script.js' defer></script></body></html>",
      css: files.css || "/* No styles generated */",
      js: files.js || "// No JavaScript generated",
    });

    const frameId = nanoid(12);
    const frame = await createFrame({
      frameId,
      projectId,
      designCode: code,
    });

    console.log("Frame created:", frameId);

    return NextResponse.json({
      code,
      files: JSON.parse(code),
      frame,
      quota: quotaResult.quota,
    });
  } catch (error) {
    console.error("Generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("API_KEY")) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 500 });
    }

    if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Generation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
