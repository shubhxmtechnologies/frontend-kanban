import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import useBoardStore from '../../store/useBoardStore';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (taskData: any) => Promise<void>;
}

const CreateTaskModal = ({ isOpen, onClose, onAdd }: CreateTaskModalProps) => {
    const { currentBoard } = useBoardStore();
    const boardMembers = currentBoard?.board.members || [];
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [labelsStr, setLabelsStr] = useState('');
    const [assignedTo, setAssignedTo] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        if (!trimmedTitle) return;

        const labels = labelsStr.split(',').map(l => l.trim()).filter(l => l.length > 0);
        
        setIsSaving(true);
        try {
            await onAdd({
                title: trimmedTitle,
                description: description.trim(),
                priority,
                labels,
                assignedTo
            });
            setTitle('');
            setDescription('');
            setPriority('medium');
            setLabelsStr('');
            setAssignedTo([]);
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
                        Create New Task
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
                
                <form id="create-task-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {/* Title */}
                    <div>
                        <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            placeholder="What needs to be done?"
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
                            className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24 custom-scrollbar"
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
                                className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
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
                                className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
                                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-[12px] font-medium transition-colors ${
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
                        className="px-4 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-task-form"
                        disabled={isSaving || !title.trim()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:bg-purple-600 text-white text-[13px] font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
