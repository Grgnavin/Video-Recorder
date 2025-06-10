import { createMiddleware, detectBot, shield } from '@arcjet/next';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import aj from "./lib/arcjet";

// Allowed origins for CORS
const allowedOrigins = [
  'https://video-recorder-silk.vercel.app',
  // Include localhost for development if necessary
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
];

async function mainMiddleware(request: NextRequest) {
  // Handle CORS preflight requests first
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const response = new NextResponse(null, { status: 204 });
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Apply your existing authentication logic
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session && !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Clone the response for CORS headers
  const response = NextResponse.next();
  
  // Set CORS headers for all responses
  const origin = request.headers.get('origin');
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

const validate = aj
  .withRule(shield({ mode: 'LIVE' }))
  .withRule(detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE", "GOOGLE_CRAWLER"] }));

// Chain the middlewares
export default createMiddleware(validate, mainMiddleware);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)",
    "/api/:path*" // Ensure API routes are covered
  ]
};