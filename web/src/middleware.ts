import { NextRequest, NextResponse } from "next/server";

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifySession(
  cookieValue: string,
  secret: string
): Promise<string | null> {
  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const loginId = cookieValue.substring(0, dotIndex);
  const signature = cookieValue.substring(dotIndex + 1);

  const expected = await hmacSign(loginId, secret);

  if (signature !== expected) return null;

  return loginId;
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!sessionCookie || !(await verifySession(sessionCookie, secret))) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (sessionCookie) {
      response.cookies.delete("session");
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon\\.ico).*)"],
};
