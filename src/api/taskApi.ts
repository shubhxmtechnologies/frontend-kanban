import API from './axiosInstance';

export const createTask = async (listId: string, taskData: any) => {
    const { data } = await API.post(`/api/lists/${listId}/tasks`, taskData);
    return data;
};

export const getTasks = async (boardId: string) => {
    const { data } = await API.get(`/api/boards/${boardId}/tasks`);
    return data;
};

export const getTask = async (taskId: string) => {
    const { data } = await API.get(`/api/tasks/${taskId}`);
    return data;
}

export const updateTask = async (taskId: string, taskData: any) => {
    const { data } = await API.put(`/api/tasks/${taskId}`, taskData);
    return data;
};

export const deleteTask = async (taskId: string) => {
    const { data } = await API.delete(`/api/tasks/${taskId}`);
    return data;
};

export const moveTask = async (taskId: string, moveData: any) => {
    const { data } = await API.put(`/api/tasks/${taskId}/move`, moveData);
    return data;
};

export const toggleComplete = async (taskId: string) => {
    const { data } = await API.patch(`/api/tasks/${taskId}/toggle-complete`)
    return data;
}

export const updateLabels = async (taskId: string, taskData: any) => {
    const { data } = await API.put(`/api/tasks/${taskId}/labels`, taskData)
    return data;
}

export const updateAssignees = async (taskId: string, taskData: string) => {
    const { data } = await API.put("/api/tasks/" + taskId + "/assignees", taskData);
    return data
}

export const updatePriority = async (taskId: string, taskData: any) => {
    const { data } = await API.patch("/api/tasks/" + taskId + "/priority", taskData);
    return data;
}