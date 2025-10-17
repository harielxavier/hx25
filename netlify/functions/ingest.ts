import { Handler } from "@netlify/functions";

interface AnalyticsPayload {
  ts: number;
  ip: string;
  ua: string;
  path: string;
  ref: string;
  session_id: string;
}

export const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // Parse the payload
    const payload: AnalyticsPayload = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!payload.ip || !payload.path) {
      return {
        statusCode: 400,
        body: "Missing required fields",
      };
    }

    // Prepare data for Supabase (cap field sizes for safety)
    const data = {
      ts: new Date(payload.ts || Date.now()).toISOString(),
      ip: (payload.ip || "").slice(0, 64),
      ua: (payload.ua || "").slice(0, 512),
      path: (payload.path || "").slice(0, 512),
      ref: (payload.ref || "").slice(0, 512),
      session_id: (payload.session_id || "").slice(0, 128),
    };

    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return {
        statusCode: 500,
        body: "Server configuration error",
      };
    }

    // Insert into Supabase using REST API (no need for SDK)
    const response = await fetch(`${supabaseUrl}/rest/v1/web_hits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase insert failed:", response.status, errorText);
      return {
        statusCode: 500,
        body: "Failed to store analytics",
      };
    }

    // Success - return 204 No Content
    return {
      statusCode: 204,
      body: "",
    };
  } catch (error) {
    console.error("Analytics ingest error:", error);
    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }
};
