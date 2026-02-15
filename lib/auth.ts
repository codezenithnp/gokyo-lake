import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

type AdminTokenPayload = {
  adminId: string;
  email: string;
  role: string;
};

const { JWT_SECRET, NODE_ENV } = process.env;

if (!JWT_SECRET) {
  const message = "Missing JWT_SECRET environment variable.";
  if (NODE_ENV === "production") {
    throw new Error(message);
  }
  console.warn(message);
}

const secretKey = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

export async function signAdminToken(payload: AdminTokenPayload) {
  if (!secretKey) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string) {
  if (!secretKey) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  const { payload } = await jwtVerify<AdminTokenPayload>(token, secretKey);
  return payload;
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export async function getAdminFromRequest(req: NextRequest | Request) {
  const cookieHeader = req.headers.get("cookie");
  const token =
    "cookies" in req && typeof req.cookies?.get === "function"
      ? req.cookies.get("admin_token")?.value ?? null
      : getCookieValue(cookieHeader, "admin_token");

  if (!token) return null;

  try {
    const payload = await verifyAdminToken(token);
    return payload;
  } catch {
    return null;
  }
}
