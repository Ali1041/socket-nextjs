import { Server } from 'socket.io'

const rooms = {};

export const config = {
    api: {
        bodyParser: false,
    },
};


export default async (req, res) => {
    if (!res.socket.server.io) {
        console.log("New Socket.io server...");
        // adapt Next's net Server to http Server
        const httpServer = res.socket.server;
        const io = new Server(httpServer, {
            path: "/api/socketio",
        });
        io.on('connection', (socket) => {
            socket.on('join', (data) => {
                const { roomId, username } = data;

                socket.join(roomId);

                if (!rooms[roomId]) {
                    rooms[roomId] = [];
                }
                console.log(socket.id, roomId)
                rooms[roomId].push({ socketId: socket.id, username });

                io.to(roomId).emit('userList', rooms[roomId].map(user => user.username));
            });

            socket.on('sendMessage', (data) => {
                const { roomId, message } = data;
                io.to(roomId).emit('receiveMessage', { username: rooms[roomId].find(user => user.socketId === socket.id).username, message });
            });

            socket.on('disconnect', () => {
                for (const roomId in rooms) {
                    const userIndex = rooms[roomId].findIndex(user => user.socketId === socket.id);
                    if (userIndex !== -1) {
                        rooms[roomId].splice(userIndex, 1);
                        io.to(roomId).emit('userList', rooms[roomId].map(user => user.username));
                        break;
                    }
                }
            });
        });
        // append SocketIO server to Next.js socket server response
        res.socket.server.io = io;
    }
    res.end();
}