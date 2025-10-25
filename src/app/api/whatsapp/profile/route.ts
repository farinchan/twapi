import { NextResponse } from "next/server";
import { profileWhatsappSchema } from "@/lib/validation";
import * as whatsapp from "wa-multi-session";

export async function POST(req: Request) {
    const json = await req.json().catch(() => ({}));
    const parsed = profileWhatsappSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
            { status: 422 }
        );
    }
    const { sessionId, to } = parsed.data;

    const isExist = whatsapp.getSession(sessionId);
    if (!isExist) {
        return NextResponse.json(
            { message: "Session tidak ditemukan - pastikan sessionId sudah benar atau Scan QR Code kembali" },
            { status: 404 }
        );
    }

    try {
        const isRegistered = await whatsapp.isExist({
            sessionId: sessionId,
            to: to,
            isGroup: to.endsWith("@g.us"),
        });

        if (!isRegistered) {
            return NextResponse.json(
                { message: "Nomor tujuan tidak terdaftar di WhatsApp" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Cek profil WhatsApp berhasil",
            data: {
                sessionId: sessionId,
                to: to,
                isGroup: to.endsWith("@g.us"),
            },
        });
    } catch (error) {
        console.error("Error sending WhatsApp document message:", error);
        return NextResponse.json(
            { message: "Gagal mengirim pesan dokumen WhatsApp" },
            { status: 500 }
        );
    }
}