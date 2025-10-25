import { NextResponse } from "next/server";
import { documentMessageSchema } from "@/lib/validation";
import * as whatsapp from "wa-multi-session";

export async function POST(req: Request) {
    const json = await req.json().catch(() => ({}));
    const parsed = documentMessageSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
            { status: 422 }
        );
    }
    const { sessionId, to, media, text, filename, isGroup } = parsed.data;

    const isExist = whatsapp.getSession(sessionId);
    if (!isExist) {
        return NextResponse.json(
            { message: "Session tidak ditemukan - pastikan sessionId sudah benar atau Scan QR Code kembali" },
            { status: 404 }
        );
    }

    try {
        await whatsapp.sendTyping({
            sessionId: sessionId,
            to: to,
            duration: Math.min(5000, (text?.length ?? 0) * 100),
            isGroup: isGroup,
        });
        const response = await whatsapp.sendDocument({
            sessionId: sessionId,
            to: to,
            text: text,
            media: media,
            filename: filename,
            isGroup: isGroup,
        });
        return NextResponse.json({
            success: true,
            message: "Pesan dokumen WhatsApp berhasil dikirim",
            data: response,
        });
    } catch (error) {
        console.error("Error sending WhatsApp document message:", error);
        return NextResponse.json(
            { message: "Gagal mengirim pesan dokumen WhatsApp" },
            { status: 500 }
        );
    }
}