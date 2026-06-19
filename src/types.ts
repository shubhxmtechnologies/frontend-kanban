export interface IBoard {
    _id: string;
    title: string;
    tag?: string;
    owner: {
        _id: string;
        name?: string;
        avatar?: string;
        email?: string;
    };
    members: {
        _id: string;
        name?: string;
        email?: string;
        avatar?: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IList {
    _id: string;
    title: string;
    description?: string;
    board: string;
    position: number;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

type Priority = "low" | "medium" | "high";

export interface ITask {
    _id: string;
    title: string;
    description?: string;
    list: {
        _id: string;
        title: string;
        description?: string;
    };
    board: string;
    position: number;
    assignedTo?: {
        _id: string;
        name?: string;
        email?: string;
        avatar?: string;
    }[];
    labels?: string[] | null;
    priority?: Priority | null;
    completed?: boolean;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CurrentBoard {
    board: IBoard;
    lists: IList[];
    tasks: ITask[];
}

export type ICurrentBoard = CurrentBoard | null;

export interface IUser {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    boards: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: string;
    text: string;
    task: string;
    board: string;
    author: {
        _id: string;
        name?: string;
        email?: string;
        avatar?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}