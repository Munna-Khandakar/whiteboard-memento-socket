import io from 'socket.io-client';

type Socket = SocketIOClient.Socket; // Type alias for Socket.IO client

const socket: Socket = io('http://localhost:4000', {
    // Optional connection options (e.g., reconnection attempts)
});

export default socket;
