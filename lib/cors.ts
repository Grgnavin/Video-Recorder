import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "https://video-recorder-optebc0ka-grgnavins-projects.vercel.app",
  "https://video-recorder-silk.vercel.app"
];

export function handleCORS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const res = new NextResponse();

  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
    res.headers.set("Access-Control-Allow-Origin", "https://video-recorder-opteb0ka-grgnavins-projects.vercel.app");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.headers.set("Access-Control-Allow-Credentials", "true"); // if using cookies


  return res;
}
