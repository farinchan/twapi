"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { getSocket } from "@/lib/socket";

export function useSocket(token?: string) {
  const socket = useMemo(() => getSocket(token), [token]);
  const [connected, setConnected] = useState(socket.connected);
  const eventsRef = useRef<{ [k: string]: (...args: any[]) => void }>({});

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onError = (err: any) => console.error("socket error:", err);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("error", onError);

    // connect manual (kalau belum)
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.off("error", onError);
      // jangan socket.close() di sini kalau mau singleton hidup global
      // kalau mau benar2 putus saat unmount, pakai socket.disconnect();
    };
  }, [socket]);

  // helper: subscribe event dengan auto-cleanup
  const on = (event: string, handler: (...args: any[]) => void) => {
    // simpan supaya bisa dicabut di cleanup manual jika perlu
    eventsRef.current[event] = handler;
    socket.on(event, handler);
    return () => socket.off(event, handler);
  };

  const emit = (event: string, payload?: any, ack?: (res: any) => void) => {
    ack ? socket.emit(event, payload, ack) : socket.emit(event, payload);
  };

  return { socket, connected, on, emit };
}
