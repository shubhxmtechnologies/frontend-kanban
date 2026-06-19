import axios from "axios";
import socket from '../socket/socket';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL!,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Send socket ID so backend can exclude sender from broadcasts
    if (socket.id) {
        config.headers['x-socket-id'] = socket.id;
    }
    return config;
}
);

export default API;