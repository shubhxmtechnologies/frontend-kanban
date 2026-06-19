import API from './axiosInstance';

export const createList = async (boardId: string, listData: any) => {
    const { data } = await API.post(`/api/boards/${boardId}/lists`, listData);
    return data;
};

export const getLists = async (boardId: string) => {
    const { data } = await API.get(`/api/boards/${boardId}/lists`);
    return data;
};

export const updateList = async (listId: string, listData: any) => {
    const { data } = await API.put(`/api/lists/${listId}`, listData);
    return data;
};

export const deleteList = async (listId: string) => {
    const { data } = await API.delete(`/api/lists/${listId}`);
    return data;
};