import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Trash2, Settings } from 'lucide-react';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';
import ListSettingsModal from './ListSettingsModal';
import DeleteListModal from './DeleteListModal';
import type { IList, ITask } from '../../types';

interface KanbanListProps {
    list: IList;
    tasks: ITask[];
    onAddTask: (taskData: any) => Promise<void> | void;
    onDeleteTask: (taskId: string) => Promise<void> | void;
    onDeleteList: (listId: string) => Promise<void> | void;
}

const KanbanList = ({ list, tasks, onAddTask, onDeleteTask, onDeleteList }: KanbanListProps) => {
    const { setNodeRef, isOver } = useDroppable({ id: list._id });
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    return (
        <>
            <article
                className={`flex flex-col shrink-0 transition-colors duration-150 bg-white dark:bg-[#141416] rounded-xl w-[280px] max-h-[calc(100vh-160px)] shadow-sm border ${isOver ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-zinc-200 dark:border-white/[0.08]'}`}
                aria-label={`${list.title} column with ${tasks.length} tasks`}
                style={{ borderTopColor: list.color || '#e4e4e7', borderTopWidth: '4px' }}
            >
                {/* Column header */}
                <div className="flex flex-col px-3 py-3 gap-1.5 border-b border-zinc-100 dark:border-white/[0.06] shrink-0">
                    <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <h2
                                className="truncate text-[13px] font-semibold tracking-[-0.01em] text-zinc-900 dark:text-white"
                                title={list.title}
                            >
                                {list.title}
                            </h2>

                            {/* Task count badge */}
                            {tasks.length > 0 && (
                                <span
                                    className="inline-flex items-center justify-center px-1.5 h-5 rounded text-[11px] font-bold bg-zinc-100 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 shrink-0"
                                    aria-label={`${tasks.length} tasks`}
                                >
                                    {tasks.length}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0 -mr-1.5">
                            {/* Settings list button */}
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                aria-label={`Settings for list "${list.title}"`}
                            >
                                <Settings size={14} aria-hidden="true" />
                            </button>

                            {/* Delete list button */}
                            <button
                                onClick={() => setIsDeleteOpen(true)}
                                className="flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                aria-label={`Delete list "${list.title}"`}
                            >
                                <Trash2 size={14} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                    {list.description && (
                        <p 
                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                            className={`text-[12px] text-zinc-500 dark:text-zinc-400/80 leading-snug cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors ${isDescExpanded ? '' : 'line-clamp-1'}`} 
                            title={isDescExpanded ? "Click to collapse" : "Click to expand"}
                        >
                            {list.description}
                        </p>
                    )}
                </div>

                {/* Task list */}
                <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                    <div
                        ref={setNodeRef}
                        className="flex flex-col gap-2 overflow-y-auto flex-1 p-2 hide-scrollbar min-h-[48px]"
                        role="list"
                        aria-label={`Tasks in ${list.title}`}
                    >
                        {tasks.length === 0 && (
                            <div className="flex items-center justify-center h-full min-h-[60px] text-[12px] font-medium text-zinc-400 dark:text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-white/[0.05] rounded-lg bg-zinc-50/50 dark:bg-white/[0.02]">
                                Move or create task here
                            </div>
                        )}
                        {tasks.map((task) => (
                            <TaskCard key={task._id} task={task} onDelete={onDeleteTask} />
                        ))}
                    </div>
                </SortableContext>

                {/* Add task form */}
                <div className={`shrink-0 p-2 ${tasks.length > 0 ? 'border-t border-zinc-100 dark:border-white/[0.06]' : ''}`}>
                    <AddTaskForm onAdd={onAddTask} />
                </div>
            </article>

            <ListSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                list={list}
            />

            <DeleteListModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={async () => { await onDeleteList(list._id); }}
                listName={list.title}
            />
        </>
    );
};

export default KanbanList;