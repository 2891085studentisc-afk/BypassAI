function extractJsonObject(text) {
  const t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) return t.slice(start, end + 1);
  return t;
}

const testCases = [
  '```json\n{"companyName": "Test"}\n```',
  'Here is the JSON: {"companyName": "Test"}',
  '{"companyName": "Test"}',
  '   {"companyName": "Test"}   ',
  '```\n{"companyName": "Test"}\n```',
  'Some text before {"companyName": "Test"} and after',
];

testCases.forEach((tc, i) => {
  console.log(`Test ${i + 1}:`, extractJsonObject(tc));
});
