import API from './axiosInstance';

export const createBoard = async (boardData: any) => {
    const { data } = await API.post('/api/boards', boardData);
    return data;
};

export const getBoards = async () => {
    const { data } = await API.get('/api/boards');
    return data;
};

export const getBoard = async (boardId: any) => {
    const { data } = await API.get(`/api/boards/${boardId}`);
    return data;
};

export const updateBoard = async (boardId: string, boardData: any) => {
    const { data } = await API.put(`/api/boards/${boardId}`, boardData);
    return data;
};

export const deleteBoard = async (boardId: string) => {
    const { data } = await API.delete(`/api/boards/${boardId}`);
    return data;
};

export const addMember = async (boardId: string, email: string) => {
    const { data } = await API.put(`/api/boards/${boardId}/members`, { email });
    return data;
};

export const removeMember = async (boardId: string, userId: string) => {
    const { data } = await API.delete(`/api/boards/${boardId}/members/${userId}`);
    return data;
};