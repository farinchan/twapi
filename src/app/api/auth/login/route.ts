// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { User, initializeDatabase } from "@/lib/db";
import { generateToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Inisialisasi database
    await initializeDatabase();

    const json = await req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;

    console.log('Login attempt for email:', email);

    // Cari user berdasarkan email - use raw: true to get plain object
    const user = await User.findOne({ 
      where: { email },
      attributes: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt'],
      raw: true, // Get plain object directly
    });
    
    if (!user) {
      console.log('Login failed: User not found');
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    console.log('Login successful for user:', user.email);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Set token ke cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        access_token: token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server", error: error.message },
      { status: 500 }
    );
  }
}
