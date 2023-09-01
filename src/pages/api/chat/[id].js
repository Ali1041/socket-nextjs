import { Server } from 'socket.io'

const rooms = {};

export default function Sockethandler(
    req,
    res
) {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io


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
    }
    res.end()
}