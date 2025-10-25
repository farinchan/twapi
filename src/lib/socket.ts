// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token?: string) {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],     // prefer WS
      autoConnect: false,            // connect manual
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 5000,
      auth: token ? { token } : undefined, // kirim JWT di handshake
      // NOTE: kalau backend butuh path custom: path: "/socket.io"
    });
  } else if (token) {
    // update token bila berubah (mis. habis refresh)
    socket.auth = { token };
  }
  return socket;
}
