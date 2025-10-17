import type { Context } from "https://edge.netlify.com";

export default async (req: Request, context: Context) => {
  // Get client information from Netlify edge context
  const ip = context.ip ?? "0.0.0.0";
  const ua = req.headers.get("user-agent") || "";
  const ref = req.headers.get("referer") || req.headers.get("referrer") || "";
  const url = new URL(req.url);

  // Generate or retrieve session ID from cookie
  const cookies = req.headers.get("cookie") || "";
  let sessionId = "";
  const sessionMatch = cookies.match(/_session=([^;]+)/);
  if (sessionMatch) {
    sessionId = sessionMatch[1];
  } else {
    // Generate new session ID
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  // Only track HTML page visits (not assets)
  const isPageVisit = !url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|json|map)$/);

  if (isPageVisit) {
    // Fire-and-forget analytics tracking (don't block the request)
    context.waitUntil(
      fetch(`${url.origin}/.netlify/functions/ingest`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ts: Date.now(),
          ip,
          ua,
          path: url.pathname,
          ref,
          session_id: sessionId,
        }),
      }).catch((err) => {
        // Silently fail - don't break the user's request
        console.error("Analytics ingest error:", err);
      })
    );
  }

  // Set session cookie and continue to the Next.js/static site
  const response = await context.next();

  // Only set cookie if it's a new session
  if (!sessionMatch && isPageVisit) {
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1800` // 30 min session
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};
