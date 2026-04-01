import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const MODEL_ID = "gemini-2.0-flash";

function normalizeGcpProject(value: string | undefined): string | undefined {
  const v = value?.trim();
  if (!v) return undefined;
  return v.replace(/^projects\//, "");
}

function createGenAI(): GoogleGenAI | { error: string } {
  const useVertex =
    process.env.GEMINI_USE_VERTEX === "1" || process.env.GEMINI_USE_VERTEX?.toLowerCase() === "true";
  const project = normalizeGcpProject(process.env.GOOGLE_CLOUD_PROJECT);
  const location = process.env.GOOGLE_CLOUD_LOCATION?.trim() || "europe-west2";

  if (useVertex) {
    if (!project) {
      return { error: "GOOGLE_CLOUD_PROJECT is required for Vertex AI (e.g. 963018105457 or projects/963018105457)." };
    }
    return new GoogleGenAI({ vertexai: true, project, location });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "GEMINI_API_KEY is not configured." };
  }
  return new GoogleGenAI({ apiKey });
}

type CompanyIntel = {
  companyName: string;
  companyNumber: string | null;
  directors: string[];
  summary: string | null;
};

function extractJsonObject(text: string): string {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) return t.slice(start, end + 1);
  return t;
}

function normalizeIntel(raw: unknown): CompanyIntel {
  const o = raw as Record<string, unknown>;
  const companyName =
    typeof o.companyName === "string" && o.companyName.trim() ? o.companyName.trim() : "Unknown entity";
  const companyNumber =
    typeof o.companyNumber === "string" && o.companyNumber.trim() ? o.companyNumber.trim() : null;
  const summary =
    typeof o.summary === "string" && o.summary.trim() ? o.summary.trim() : null;
  let directors: string[] = [];
  if (Array.isArray(o.directors)) {
    directors = o.directors
      .filter((d): d is string => typeof d === "string" && d.trim().length > 0)
      .map((d) => d.trim());
  }
  return { companyName, companyNumber, directors, summary };
}

export async function POST(request: NextRequest) {
  const aiOrErr = createGenAI();
  if ("error" in aiOrErr) {
    return NextResponse.json({ error: aiOrErr.error, code: "NO_KEY" }, { status: 503 });
  }
  const ai = aiOrErr;

  let body: { query?: string };
  try {
    body = (await request.json()) as { query?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json({ error: "Missing query." }, { status: 400 });
  }
  if (query.length > 200) {
    return NextResponse.json({ error: "Query too long." }, { status: 400 });
  }

  const userPrompt = `Find the official company number and current director names for "${query}" in the United Kingdom.

Use Google Search and prefer authoritative UK sources (Companies House, gov.uk, the company’s own filings).

Return ONLY a single JSON object (no markdown, no code fences) with exactly these keys:
- "companyName": string — the official registered name you believe matches the user’s search
- "companyNumber": string or null — UK Companies House number if found, else null
- "directors": string[] — current director full names as listed on Companies House or equivalent official source; empty array if unknown
- "summary": string — one professional sentence summarising the entity for a compliance-style card

If the search is ambiguous or data cannot be verified, still return best-effort companyName and empty directors with null companyNumber.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: userPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJsonObject(text));
    } catch {
      return NextResponse.json(
        { error: "Could not parse structured company data from the model.", raw: text.slice(0, 500) },
        { status: 502 },
      );
    }

    const data = normalizeIntel(parsed);
    return NextResponse.json({ data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gemini request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
