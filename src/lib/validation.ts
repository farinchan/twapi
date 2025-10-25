
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama terlalu pendek"),
  email: z.string().trim().email("Email tidak valid"),
  password: z.string()
    .min(8, "Minimal 8 karakter")
    .regex(/[A-Z]/, "Harus ada huruf besar")
    .regex(/[a-z]/, "Harus ada huruf kecil")
    .regex(/[0-9]/, "Harus ada angka"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const messageSchema = z.object({
  sessionId: z.string().trim().min(1, "Session ID tidak boleh kosong"),
  to: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]*$/, "Nomor tujuan tidak valid: hanya angka dan tidak boleh diawali 0"),
  text: z.string().trim().min(1, "Pesan tidak boleh kosong"),
  isGroup: z.boolean().optional(),
});

export type MessageInput = z.infer<typeof messageSchema>;

export const imageMessageSchema = z.object({
  sessionId: z.string().trim().min(1, "Session ID tidak boleh kosong"),
  to: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]*$/, "Nomor tujuan tidak valid: hanya angka dan tidak boleh diawali 0"),
  image: z.string().trim().min(1, "URL gambar tidak boleh kosong"),
  text: z.string().trim().optional(),
  isGroup: z.boolean().optional(),
});

export type ImageMessageInput = z.infer<typeof imageMessageSchema>;

export const documentMessageSchema = z.object({
  sessionId: z.string().trim().min(1, "Session ID tidak boleh kosong"),
  to: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]*$/, "Nomor tujuan tidak valid: hanya angka dan tidak boleh diawali 0"),
  text: z.string().trim().optional(),
  media: z.string().trim().min(1, "URL dokumen tidak boleh kosong"),
  filename: z.string().trim().min(1, "Nama file tidak boleh kosong"),
  isGroup: z.boolean().optional(),
});

export type DocumentMessageInput = z.infer<typeof documentMessageSchema>;

export const profileWhatsappSchema = z.object({
  sessionId: z.string().trim().min(1, "Session ID tidak boleh kosong"),
  to: z
    .string()
    .trim()
    .refine((v) => v.includes("@s.whatsapp.net") || v.includes("@g.us"), {
      message: "target must contain '@s.whatsapp.net' or '@g.us'",
    }),
});

export type ProfileWhatsappInput = z.infer<typeof profileWhatsappSchema>;