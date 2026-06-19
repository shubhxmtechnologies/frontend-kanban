import { useState, useEffect, useMemo } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getBoard } from '../../api/boardApi';
import type { ITask } from '../../types';

interface UpdateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: ITask;
    onUpdate: (taskId: string, taskData: any) => Promise<void>;
}

const UpdateTaskModal = ({ isOpen, onClose, task, onUpdate }: UpdateTaskModalProps) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority || 'medium');
    const [labelsStr, setLabelsStr] = useState(task.labels?.join(', ') || '');
    const [assignedTo, setAssignedTo] = useState<string[]>(task.assignedTo?.map(a => a._id) || []);
    const [completed, setCompleted] = useState(task.completed || false);
    
    const [isSaving, setIsSaving] = useState(false);
    
    const [boardMembers, setBoardMembers] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && task.board) {
            getBoard(task.board).then((data) => {
                if (data && data.board) {
                    setBoardMembers(data.board.members || []);
                }
            }).catch(err => console.error("Failed to fetch board members", err));
        }
    }, [isOpen, task.board]);

    useEffect(() => {
        if (isOpen) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority || 'medium');
            setLabelsStr(task.labels?.join(', ') || '');
            setAssignedTo(task.assignedTo?.map(a => a._id) || []);
            setCompleted(task.completed || false);
        }
    }, [isOpen, task]);

    // Detect if any field has changed from original task values
    const hasChanges = useMemo(() => {
        if (title.trim() !== task.title) return true;
        if (description.trim() !== (task.description || '')) return true;
        if (priority !== (task.priority || 'medium')) return true;
        if (completed !== (task.completed || false)) return true;

        // Compare labels
        const currentLabels = labelsStr.split(',').map(l => l.trim()).filter(l => l.length > 0);
        const originalLabels = task.labels || [];
        if (currentLabels.length !== originalLabels.length || 
            !currentLabels.every((l, i) => l === originalLabels[i])) return true;

        // Compare assignees (sorted for order-independent comparison)
        const originalAssignees = (task.assignedTo?.map(a => a._id) || []).slice().sort();
        const currentAssignees = assignedTo.slice().sort();
        if (currentAssignees.length !== originalAssignees.length ||
            !currentAssignees.every((id, i) => id === originalAssignees[i])) return true;

        return false;
    }, [title, description, priority, labelsStr, assignedTo, completed, task]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle || !hasChanges) return;

        const labels = labelsStr.split(',').map(l => l.trim()).filter(l => l.length > 0);
        
        setIsSaving(true);
        try {
            await onUpdate(task._id, {
                title: trimmedTitle,
                description: description.trim(),
                priority,
                labels,
                assignedTo,
                completed
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const toggleAssignee = (userId: string) => {
        if (assignedTo.includes(userId)) {
            setAssignedTo(prev => prev.filter(id => id !== userId));
        } else {
            setAssignedTo(prev => [...prev, userId]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={!isSaving ? onClose : undefined}
                aria-hidden="true"
            />
            <div 
                className="relative bg-white dark:bg-[#141416] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-white/10"
                role="dialog"
                aria-modal="true"
            >
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between shrink-0">
                    <h2 className="text-[16px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                        Update Task
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <form id="update-task-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {/* Status (Completed Toggle) */}
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-white/5 p-3 rounded-lg border border-zinc-100 dark:border-white/10">
                        <input
                            type="checkbox"
                            id="task-completed"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            disabled={isSaving}
                            className="w-4 h-4 text-purple-600 bg-zinc-100 border-zinc-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer disabled:opacity-50"
                        />
                        <label htmlFor="task-completed" className="text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer flex-1 select-none">
                            Mark as Completed
                        </label>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                            placeholder="Task title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Description <span className="text-zinc-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24 custom-scrollbar disabled:opacity-50"
                            placeholder="Add a more detailed description..."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Priority */}
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        {/* Labels */}
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                Labels <span className="text-zinc-400 font-normal">(Comma separated)</span>
                            </label>
                            <input
                                type="text"
                                value={labelsStr}
                                onChange={(e) => setLabelsStr(e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                                placeholder="e.g. bug, feature, frontend"
                            />
                        </div>
                    </div>

                    {/* Assignees */}
                    {boardMembers.length > 0 && (
                        <div>
                            <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Assign To <span className="text-zinc-400 font-normal">(Optional)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {boardMembers.map(member => (
                                    <button
                                        key={member._id}
                                        type="button"
                                        onClick={() => toggleAssignee(member._id)}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-[12px] font-medium transition-colors disabled:opacity-50 ${
                                            assignedTo.includes(member._id)
                                                ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300'
                                                : 'bg-zinc-50 dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20'
                                        }`}
                                    >
                                        <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] text-zinc-500 dark:text-zinc-300 uppercase">
                                                    {member.name?.charAt(0) || member.email?.charAt(0) || '?'}
                                                </span>
                                            )}
                                        </div>
                                        {member.name || member.email?.split('@')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </form>

                <div className="px-6 py-4 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/10 flex items-center justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="update-task-form"
                        disabled={isSaving || !title.trim() || !hasChanges}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-purple-600 text-white text-[13px] font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateTaskModal;
