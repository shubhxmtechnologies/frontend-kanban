import API from './axiosInstance';

export const getComments = async (taskId: string) => {
    const { data } = await API.get(`/api/tasks/${taskId}/comments`);
    return data;
};

export const createComment = async (taskId: string, text: string) => {
    const { data } = await API.post(`/api/tasks/${taskId}/comments`, { text });
    return data;
};

export const updateComment = async (commentId: string, text: string) => {
    const { data } = await API.put(`/api/comments/${commentId}`, { text });
    return data;
};

export const deleteComment = async (commentId: string) => {
    const { data } = await API.delete(`/api/comments/${commentId}`);
    return data;
};
