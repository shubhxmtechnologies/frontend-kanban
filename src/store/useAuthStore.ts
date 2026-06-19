import { create } from 'zustand';
import type { IUser } from '../types';

interface AuthState {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setCredentials: (user: any, token: string) => void;
    setUser: (user: any) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem('token'),

    setCredentials: (user: IUser | null, token: string | null) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        set({ user, token, isAuthenticated: !!token });
    },

    setUser(user: IUser | null) {
        set({ user })
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export default useAuthStore;