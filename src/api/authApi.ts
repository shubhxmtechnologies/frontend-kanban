import API from './axiosInstance';

export const registerUser = async (userData: any) => {
    const { data } = await API.post('/api/auth/register', userData);
    return data;
};

export const loginUser = async (userData: any) => {
    const { data } = await API.post('/api/auth/login', userData);
    return data;
};

export const getMe = async () => {
    try {
        const { data } = await API.get('/api/auth/me');
        return data;
    } catch (error: any) {
        if (
            error.response?.data?.message === "Token expired"
        ) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        throw error;
    }
};

export const updateMe = async (userData: any) => {
    const { data } = await API.put('/api/auth/update', userData);
    return data;
};