import { Server } from 'socket.io';
import http from 'http';
import app from '../app.js';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

const DEFAULT_CALL_DURATION_MS = 5 * 60 * 1000;
const MAX_CALL_DURATION_MS = 30 * 60 * 1000;
const activeCalls = new Map();

function endCall(roomId, reason = 'timeout') {
    const call = activeCalls.get(roomId);
    if (!call) {
        return;
    }

    clearTimeout(call.timer);
    io.to(roomId).emit('call_ended', { roomId, reason });
    activeCalls.delete(roomId);
    io.socketsLeave(roomId);
}

io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (!userId) {
        socket.disconnect(true);
        return;
    }

    socket.join(userId);

    socket.on('join_call', ({ roomId, callType, participants = [], durationMs }) => {
        if (!roomId) {
            socket.emit('call_error', { message: 'roomId is required' });
            return;
        }

        socket.join(roomId);

        if (!activeCalls.has(roomId)) {
            const parsedDuration = Number(durationMs);
            const callDurationMs = Number.isFinite(parsedDuration)
                ? Math.min(Math.max(parsedDuration, 1000), MAX_CALL_DURATION_MS)
                : DEFAULT_CALL_DURATION_MS;
            const timer = setTimeout(() => endCall(roomId, 'duration_limit'), callDurationMs);
            activeCalls.set(roomId, {
                callType,
                participants,
                startedBy: userId,
                startedAt: Date.now(),
                durationMs: callDurationMs,
                timer
            });
        }

        socket.to(roomId).emit('user_joined_call', { userId, roomId });
    });

    socket.on("offer", ({ offer, roomId }) => {
        if (!roomId) {
            socket.emit('call_error', { message: 'roomId is required' });
            return;
        }
        socket.to(roomId).emit("offer", { from: userId, offer });
    });

    socket.on("answer", ({ answer, roomId }) => {
        if (!roomId) {
            socket.emit('call_error', { message: 'roomId is required' });
            return;
        }
        socket.to(roomId).emit("answer", { from: userId, answer });
    });

    socket.on("ice_candidate", ({ candidate, roomId }) => {
        if (!roomId) {
            socket.emit('call_error', { message: 'roomId is required' });
            return;
        }
        socket.to(roomId).emit("ice_candidate", { from: userId, candidate });
    });

    socket.on('end_call', ({ roomId, reason = 'ended_by_user' }) => {
        if (!roomId) {
            socket.emit('call_error', { message: 'roomId is required' });
            return;
        }

        endCall(roomId, reason);
    });

    socket.on("leave_room", ({ roomId }) => {
        if (!roomId) {
            socket.emit('call_error', { message: 'roomId is required' });
            return;
        }

        socket.leave(roomId);
        socket.to(roomId).emit('user_left_call', { userId, roomId });
    });

    socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${userId}`);
        for (const [roomId, call] of activeCalls.entries()) {
            if (call.participants?.includes(userId)) {
                endCall(roomId, 'disconnect');
            }
        }
    });
});

export { server, io };