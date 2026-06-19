import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import KanbanList from './KanbanList';
import AddListForm from './AddListForm';
import type { IList, ITask } from '../../types';

interface KanbanBoardProps {
    lists: IList[];
    tasks: ITask[];
    onAddList: (title: string, description?: string) => void;
    onAddTask: (listId: string, taskData: any) => Promise<void> | void;
    onDeleteTask: (taskId: string) => Promise<void> | void;
    onDeleteList: (listId: string) => Promise<void> | void;
    onMoveTask: (taskId: string, newListId: string, newPosition: number) => void;
}

const KanbanBoard = ({ lists, tasks, onAddList, onAddTask, onDeleteTask, onDeleteList, onMoveTask }: KanbanBoardProps) => {
    const [activeTask, setActiveTask] = useState<ITask | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const findListForTask = (taskId: string) => {
        const task = tasks.find((t) => t._id === taskId);
        return task ? task.list : null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const id = String(event.active.id);
        const task = tasks.find((t) => t._id === id);
        setActiveTask(task || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;

        const activeTaskId = String(active.id);
        const overId = String(over.id);

        const activeListId = findListForTask(activeTaskId)?._id;

        let overListId = findListForTask(overId)?._id;
        if (!overListId) {
            overListId = overId;
        }

        const tasksInTargetList = tasks
            .filter((t) => t?.list?._id === overListId)
            .sort((a, b) => a.position - b.position);

        let newPosition: number;
        if (overId === overListId) {
            newPosition = tasksInTargetList.length;
        } else {
            const overTaskIndex = tasksInTargetList.findIndex((t) => t._id === overId);
            newPosition = overTaskIndex >= 0 ? overTaskIndex : tasksInTargetList.length;
        }

        if (activeListId !== overListId || activeTask?.position !== newPosition) {
            onMoveTask(activeTaskId, overListId, newPosition);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Board scroll area */}
            <div
                className="flex gap-3 sm:gap-4 overflow-x-auto items-start p-4 min-h-[calc(100vh-180px)] hide-scrollbar"
                style={{
                    touchAction: 'pan-x',
                }}
                role="region"
                aria-label="Kanban board"
            >
                {lists.map((list) => {
                    const listTasks = tasks
                        .filter((task) => task?.list?._id === list._id)
                        .sort((a, b) => a.position - b.position);

                    return (
                        <KanbanList
                            key={list._id}
                            list={list}
                            tasks={listTasks}
                            onAddTask={(title) => onAddTask(list._id, title)}
                            onDeleteTask={onDeleteTask}
                            onDeleteList={onDeleteList}
                        />
                    );
                })}
                <AddListForm onAdd={onAddList} />
            </div>

            {/* Drag overlay ghost card */}
            <DragOverlay>
                {activeTask ? (
                    <div
                        className="bg-white dark:bg-[#141416] border border-purple-500 rounded-lg p-3 w-[260px] opacity-95 shadow-2xl rotate-2"
                        aria-hidden="true"
                    >
                        <p
                            className="text-[13px] font-medium text-zinc-900 dark:text-white tracking-[-0.01em] leading-5"
                        >
                            {activeTask.title}
                        </p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;
