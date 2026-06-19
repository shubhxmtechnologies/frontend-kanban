import { create } from 'zustand';
import type { IBoard, ICurrentBoard, IList, ITask } from '../types';

interface boardState {
    boards: IBoard[];
    currentBoard: ICurrentBoard;
    lists: IList[];
    tasks: ITask[];
    isAddListFormOpen: boolean;
    searchQuery: string;

    setBoards: (boards: IBoard[]) => void;
    addBoard: (board: IBoard) => void;
    removeBoard: (boardId: string) => void;
    setCurrentBoard: (board: ICurrentBoard) => void;
    updateBoard: (board: IBoard) => void;
    updateCurrentBoard: (board: IBoard) => void;
    
    setIsAddListFormOpen: (isOpen: boolean) => void;
    setSearchQuery: (query: string) => void;

    setLists: (lists: IList[]) => void;
    addList: (list: IList) => void;
    removeList: (listId: string) => void;
    updateList: (list: IList) => void;

    setTasks: (tasks: ITask[]) => void;
    addTask: (task: ITask) => void;
    updateTaskInStore: (updatedTask: ITask) => void;
    removeTask: (taskId: string) => void;
    clearBoard: () => void;
    moveTaskInStore: (updatedTask: ITask) => void;

}

const useBoardStore = create<boardState>((set) => ({
    boards: [],
    currentBoard: null,
    lists: [],
    tasks: [],
    isAddListFormOpen: false,
    searchQuery: '',

    setBoards: (boards: IBoard[]) => set({ boards }),

    setCurrentBoard: (board: ICurrentBoard) => set({ currentBoard: board }),
    
    updateCurrentBoard: (updatedBoard: IBoard) => set((state) => ({
        currentBoard: state.currentBoard ? {
            ...state.currentBoard,
            board: updatedBoard
        } : null,
        boards: state.boards.map((b) => b._id === updatedBoard._id ? updatedBoard : b)
    })),

    setIsAddListFormOpen: (isOpen: boolean) => set({ isAddListFormOpen: isOpen }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),

    setLists: (lists: IList[]) => set({ lists }),

    setTasks: (tasks: ITask[]) => set({ tasks }),

    addBoard: (board: IBoard) => set((state) => ({
        boards: [board, ...state.boards],
    })),

    updateList: (list: IList) => set((state) => ({
        lists: state.lists.map((l) =>
            l._id === list._id ? list : l
        ),
    })),

    removeBoard: (boardId: string) => set((state) => ({
        boards: state.boards.filter((b: IBoard) => b._id !== boardId),
    })),

    addList: (list: IList) => set((state) => {
        const exists = state.lists.some((l) => l._id === list._id);
        if (exists) {
            return state;
        }
        // Otherwise, add the new task
        return {
            lists: [...state.lists, list].sort(
                (a, b) => a.position - b.position
            )
        };
    }),

    moveTaskInStore: (updatedTask: ITask) =>
        set((state) => ({
            tasks: state.tasks
                .map((t) =>
                    t._id === updatedTask._id ? updatedTask : t
                )
                .sort((a, b) => a.position - b.position),
        })),

    removeList: (listId: string) => set((state) => ({
        lists: state.lists.filter((l: IList) => l._id !== listId),
        tasks: state.tasks.filter((t: ITask) => t.list._id !== listId),
    })),

    updateBoard: (board: IBoard) => set((state) => ({
        boards: state.boards.map((b) =>
            b._id === board._id ? board : b
        ),
    })),

    addTask: (task: ITask) => set((state) => {
        // Check for duplicates using the absolute latest state
        const exists = state.tasks.some((t) => t._id === task._id);

        // If it already exists, return the current state (do nothing)
        if (exists) {
            return state;
        }

        // Otherwise, add the new task
        return {
            tasks: [...state.tasks, task].sort(
                (a, b) => a.position - b.position
            )
        };
    }),

    updateTaskInStore: (updatedTask: ITask) => set((state) => ({
        tasks: state.tasks
            .map((t) =>
                t._id === updatedTask._id ? updatedTask : t
            )
            .sort((a, b) => a.position - b.position),
    })),

    removeTask: (taskId: string) => set((state) => ({
        tasks: state.tasks.filter((t: ITask) => t._id !== taskId),
    })),
    clearBoard: () =>
        set({
            boards: [],
            currentBoard: null,
            lists: [],
            tasks: [],
        }),
}));

export default useBoardStore;