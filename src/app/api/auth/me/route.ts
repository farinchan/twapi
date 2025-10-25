// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { withAuth, getCurrentUser } from "@/lib/auth";

// Endpoint untuk mendapatkan user yang sedang login
export const GET = withAuth(async (req: Request) => {
  const user = (req as any).user;
  
  return NextResponse.json({
    success: true,
    data: {
      user: {
        id: user.userId,
        email: user.email,
        name: user.name,
      },
    },
  });
});
