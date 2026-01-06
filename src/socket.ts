import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
    if (!socket) {
        const url = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:5000';
        socket = io(url, { autoConnect: false });
    }
    return socket as Socket;
}

export function connectSocket() {
    const s = getSocket();
    if (!s.connected) s.connect();
    return s;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export default { getSocket, connectSocket, disconnectSocket };
