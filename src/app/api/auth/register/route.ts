// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { User, initializeDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Inisialisasi database
    await initializeDatabase();

    const json = await req.json().catch(() => ({}));
    const parsed = registerSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { name, email, password } = parsed.data;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Buat user baru (password akan otomatis di-hash oleh hook beforeCreate)
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Return response tanpa password
    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server", error: error.message },
      { status: 500 }
    );
  }
}
