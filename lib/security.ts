export function sanitizeInput(input: string): string {
  // Simple sanitization: remove HTML tags and trim
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateAccountNumber(accountNumber: string): boolean {
  // Allow alphanumeric characters, spaces, hyphens, and common separators
  const accountRegex = /^[a-zA-Z0-9\s\-_.#\/]+$/;
  return accountRegex.test(accountNumber) && accountNumber.length >= 3 && accountNumber.length <= 50;
}

export function validateComplaintDetails(details: string): boolean {
  const cleanDetails = details.trim();
  return cleanDetails.length >= 20 && cleanDetails.length <= 2000;
}

export function rateLimit(request: Request, limit: number = 10, windowMs: number = 60000): boolean {
  // Simple in-memory rate limiting (use Redis in production)
  const clientIP = request.headers.get("x-forwarded-for") ||
                   request.headers.get("x-real-ip") ||
                   "unknown";

  const key = `rate-limit:${clientIP}`;
  const now = Date.now();

  // This is a simple implementation - use Redis or similar in production
  if (typeof global !== "undefined" && !(global as any).rateLimitStore) {
    (global as any).rateLimitStore = new Map();
  }

  const store = (global as any).rateLimitStore as Map<string, { count: number; resetTime: number }>;

  const record = store.get(key);

  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}