import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Helper untuk mendapatkan user dari cookie token
export async function getCurrentUser(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Middleware untuk route yang memerlukan autentikasi
export function withAuth(handler: (req: Request) => Promise<NextResponse>) {
  return async (req: Request) => {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized - Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    // Tambahkan user ke request (bisa diakses di handler)
    (req as any).user = user;
    
    return handler(req);
  };
}
