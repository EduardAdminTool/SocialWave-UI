import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your-secret-key";

export function middleware(request: Request) {
  console.log("Middleware triggered for", request.url);
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, secret); // Verify JWT
    return NextResponse.next(); // Allow access
  } catch (err) {
    console.error("JWT Verification failed:", err);
    return NextResponse.redirect(new URL("/auth/login", request.url)); // Redirect to login
  }
}

export const config = {
  matcher: ["/protected/:path*"], // Apply middleware to protected routes
};
