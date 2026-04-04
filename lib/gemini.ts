const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MAX_DAILY_LOOKUPS = Number(process.env.GEMINI_DAILY_LIMIT || 500);

let lookupCount = 0;
let lookupReset = Date.now() + 24 * 60 * 60 * 1000;

function resetIfNeeded() {
  const now = Date.now();
  if (now >= lookupReset) {
    lookupCount = 0;
    lookupReset = now + 24 * 60 * 60 * 1000;
  }
}

export async function lookupCompanyEmailWithGemini(companyName: string): Promise<string | null> {
  if (!GEMINI_KEY || !companyName) {
    return null;
  }

  resetIfNeeded();

  if (lookupCount >= MAX_DAILY_LOOKUPS) {
    console.warn("Gemini lookup limit reached for today");
    return null;
  }

  lookupCount += 1;

  try {
    const prompt = `Find one likely official escalation email address for this company: ${companyName}. Respond with only the email address, no extra text.`;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        max_output_tokens: 60,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("Gemini lookup failed status", response.status);
      return null;
    }

    const data = await response.json();
    const outputText = (data?.output?.[0]?.content?.find((c: any) => c.type === "output_text")?.text as string) || "";
    const text = outputText.trim();

    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : null;
  } catch (err) {
    console.error("Gemini lookup error:", err);
    return null;
  }
}

export function getGeminiLookupUsage(): { count: number; max: number; resetAt: number } {
  resetIfNeeded();
  return { count: lookupCount, max: MAX_DAILY_LOOKUPS, resetAt: lookupReset };
}
