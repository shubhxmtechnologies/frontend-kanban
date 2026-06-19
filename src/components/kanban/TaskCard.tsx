import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ITask } from '../../types';
import DeleteTaskModal from './DeleteTaskModal';

interface TaskCardProps {
    task: ITask;
    onDelete: (taskId: string) => Promise<void> | void;
}

const TaskCard = ({ task, onDelete }: TaskCardProps) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    return (
        <div
            ref={setNodeRef}
            onClick={() => {
                if (!isDragging) {
                    navigate(`/task/${task._id}`);
                }
            }}
            className={`group relative flex flex-col gap-2 p-3 rounded-lg border cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-[box-shadow] duration-150 user-select-none
                ${isDragging
                    ? 'opacity-40 z-50 bg-white dark:bg-[#141416] border-purple-500 shadow-md ring-1 ring-purple-500/30'
                    : 'bg-white dark:bg-[#18181b] border-zinc-200 dark:border-white/[0.08] hover:border-purple-500/50 hover:shadow-sm dark:hover:bg-white/[0.02]'
                }`}
            style={{ 
                transform: CSS.Transform.toString(transform),
                transition: transition ?? 'transform 200ms ease',
                borderLeftColor: task.color || '#e4e4e7', 
                borderLeftWidth: '4px' 
            }}
            {...attributes}
            {...listeners}
            role="listitem"
            aria-label={`Task: ${task.title}${task.description ? '. ' + task.description : ''}`}
        >
            <div className="flex items-start gap-2 justify-between">
                {/* Task title */}
                <p className="flex-1 min-w-0 text-[13px] font-medium leading-5 text-zinc-900 dark:text-zinc-100 tracking-[-0.01em] break-words">
                    {task.title}
                </p>

                {/* Action buttons — appear on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isDragging) navigate(`/task/${task._id}`);
                        }}
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag hijack
                        className="flex-shrink-0 p-1 rounded-md text-zinc-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-purple-500 transition-colors"
                        aria-label={`Open task "${task.title}"`}
                        title="Open task"
                    >
                        <Maximize2 size={14} aria-hidden="true" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDeleteModalOpen(true);
                        }}
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag hijack
                        className="flex-shrink-0 p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
                        aria-label={`Delete task "${task.title}"`}
                        title="Delete task"
                    >
                        <Trash2 size={14} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Badges and date row */}
            <div className="flex items-center justify-between mt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                    {task.priority && (
                        <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider
                            ${task.priority === 'high' 
                                ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
                                : task.priority === 'medium' 
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                            }`}
                        >
                            {task.priority}
                        </span>
                    )}
                </div>
                {task.createdAt && (
                    <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
                        {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                )}
            </div>

            {/* Description */}
            {task.description && (
                <p
                    className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed"
                >
                    {task.description}
                </p>
            )}

            <DeleteTaskModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => { await onDelete(task._id); }}
                taskName={task.title}
            />
        </div>
    );
};

export default TaskCard;