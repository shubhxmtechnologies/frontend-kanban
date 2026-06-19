import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
    autoConnect: false,  // We'll connect manually when user opens a board
    auth: {
        token: localStorage.getItem('token'),
    },
});

// Update auth token before each connection
const originalConnect = socket.connect.bind(socket);
socket.connect = () => {
    socket.auth = { token: localStorage.getItem('token') };
    return originalConnect();
};

export default socket;