// Basic error monitoring utility
// In production, replace with Sentry or similar service

export function logError(error: Error, context?: Record<string, any>) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server"
  };

  console.error("🚨 Error logged:", errorData);

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === "production") {
    // Example: send to Sentry, LogRocket, etc.
    // await fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
  }
}

export function logUserAction(action: string, details?: Record<string, any>) {
  const logData = {
    action,
    details,
    timestamp: new Date().toISOString(),
    sessionId: typeof window !== "undefined" ? sessionStorage.getItem("sessionId") : "server"
  };

  console.log("📝 User action:", logData);

  // In production, send to analytics service
  if (process.env.NODE_ENV === "production") {
    // Example: send to Mixpanel, Google Analytics, etc.
  }
}