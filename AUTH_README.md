# Authentication Setup - Next.js Fullstack dengan Sequelize & MySQL

## 📋 Deskripsi

Project ini sudah dilengkapi dengan sistem autentikasi fullstack menggunakan:
- **Next.js 15** - Framework React
- **Sequelize** - ORM untuk database
- **MySQL** - Database relational
- **JWT (JSON Web Token)** - Token authentication
- **bcryptjs** - Password hashing

## 🚀 Setup Database

### 1. Install MySQL

Pastikan MySQL sudah terinstall di komputer Anda. Download di [MySQL Official Website](https://dev.mysql.com/downloads/).

### 2. Buat Database

Buka MySQL command line atau phpMyAdmin, lalu jalankan:

```sql
CREATE DATABASE twapi_fullstack;
```

### 3. Konfigurasi Environment Variables

Edit file `.env.local` sesuai dengan konfigurasi MySQL Anda:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=twapi_fullstack
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Secret (ganti dengan string random yang aman)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Next.js
NEXT_PUBLIC_API_BASE=http://localhost:3000
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Saat aplikasi pertama kali dijalankan dan endpoint auth dipanggil, Sequelize akan otomatis membuat tabel `users` di database.

## 📁 Struktur File Authentication

```
src/
├── lib/
│   ├── db/
│   │   ├── config.ts          # Konfigurasi Sequelize
│   │   ├── index.ts           # Database initialization
│   │   └── models/
│   │       └── User.ts        # Model User
│   ├── jwt.ts                 # JWT utilities
│   ├── auth.ts                # Auth middleware & helpers
│   └── validation.ts          # Zod validation schemas
│
└── app/
    └── api/
        └── auth/
            ├── register/
            │   └── route.ts   # POST /api/auth/register
            ├── login/
            │   └── route.ts   # POST /api/auth/login
            ├── logout/
            │   └── route.ts   # POST /api/auth/logout
            └── me/
                └── route.ts   # GET /api/auth/me (protected)
```

## 🔐 API Endpoints

### 1. Register (Daftar Akun Baru)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Validasi Password:**
- Minimal 8 karakter
- Harus ada huruf besar
- Harus ada huruf kecil
- Harus ada angka

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** Token JWT juga otomatis disimpan di cookie `HttpOnly` yang lebih aman.

### 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

### 4. Get Current User (Protected Route)

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Cookie: token=your_jwt_token
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

## 🛡️ Membuat Protected Route

Untuk membuat endpoint yang hanya bisa diakses user yang sudah login, gunakan `withAuth` middleware:

```typescript
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req: Request) => {
  const user = (req as any).user;
  
  // User data tersedia di req.user
  return NextResponse.json({
    message: `Hello ${user.name}!`,
  });
});
```

## 🧪 Testing dengan Postman/Thunder Client

### 1. Register User Baru
- Method: POST
- URL: http://localhost:3000/api/auth/register
- Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test1234"
}
```

### 2. Login
- Method: POST
- URL: http://localhost:3000/api/auth/login
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "Test1234"
}
```

### 3. Get Current User (pastikan sudah login)
- Method: GET
- URL: http://localhost:3000/api/auth/me
- Cookies akan otomatis dikirim jika menggunakan Postman

### 4. Logout
- Method: POST
- URL: http://localhost:3000/api/auth/logout

## 🔧 Troubleshooting

### Error: "Unable to connect to the database"
- Pastikan MySQL server sudah running
- Cek konfigurasi DB_HOST, DB_PORT, DB_USER, DB_PASSWORD di `.env.local`
- Pastikan database sudah dibuat

### Error: "Email sudah terdaftar"
- Email harus unik, gunakan email lain untuk register

### Error: "Unauthorized"
- Pastikan sudah login dan cookie token tersimpan
- Token berlaku selama 7 hari

## 📝 Catatan Keamanan

1. **Ganti JWT_SECRET** di production dengan string random yang kuat
2. **Password** otomatis di-hash menggunakan bcrypt sebelum disimpan
3. **Token** disimpan di `HttpOnly` cookie untuk mencegah XSS attack
4. **Secure flag** aktif di production mode
5. **Validasi input** menggunakan Zod schema

## 📚 Dokumentasi Library

- [Next.js Documentation](https://nextjs.org/docs)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [JWT Documentation](https://jwt.io/)
- [Zod Documentation](https://zod.dev/)

## ✨ Fitur Tambahan yang Bisa Dikembangkan

- [ ] Email verification
- [ ] Password reset/forgot password
- [ ] Refresh token mechanism
- [ ] Role-based access control (RBAC)
- [ ] OAuth integration (Google, Facebook, etc.)
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting
- [ ] Session management

---

**Happy Coding! 🚀**
