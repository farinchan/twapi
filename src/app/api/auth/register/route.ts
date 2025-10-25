// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { User, initializeDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

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

    // Hash password secara manual (double safety)
    console.log('Register: Hashing password manually...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Register: Password hashed successfully');

    // Buat user baru dengan password yang sudah di-hash
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log('Register: User created with ID:', newUser.id);

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
