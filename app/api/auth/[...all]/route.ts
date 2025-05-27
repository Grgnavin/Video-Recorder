import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "../../../../lib/auth";
import aj from "../../../../lib/arcjet";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";
import ip from "@arcjet/ip";

// Email validation rule
const emailValidation = aj.withRule(
  validateEmail({ mode: "LIVE", block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'] })   
);

// Rate limiting rule
const rateLimit = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: "2m",
    max: 2,
    characteristics: ['fingerprint']
  })
);

// Protect API with Arcjet
const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({ headers: req.headers });

  let userId = session?.user?.id ?? ip(req) ?? "127.0.0.1";

  if (req.nextUrl.pathname.startsWith('/api/auth/sign-in')) {
    const body = await req.clone().json();

    if (typeof body.email === 'string') {
      return emailValidation.protect(req, { email: body.email });
    }
  }

  return rateLimit.protect(req, { fingerprint: userId });
};

// Auth handlers from better-auth
const authHandlers = toNextJsHandler(auth.handler);
export const { GET } = authHandlers;

// ✅ CORS: Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ✅ POST handler with Arcjet + CORS
export const POST = async (req: NextRequest) => {
  const decision = await protectedAuth(req);

  if (decision.isDenied()) {
    let message = "Access denied";
    if (decision.reason.isEmail()) {
      message = "Email validation failed";
    } else if (decision.reason.isRateLimit()) {
      message = "Rate limit exceeded";
    } else if (decision.reason.isShield()) {
      message = "Shield turned on... Protected against malicious action";
    }

    return new NextResponse(
      JSON.stringify({ error: message }),
      { status: 403, headers: corsHeaders }
    );
  }

  // Call better-auth POST handler
  const response = await authHandlers.POST(req);

  // ✅ Add CORS headers to response
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
};

// ✅ Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://video-recorder-silk.vercel.app",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true"
};
