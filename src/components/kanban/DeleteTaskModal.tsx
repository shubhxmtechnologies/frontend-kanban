import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';

interface DeleteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    taskName: string;
}

const DeleteTaskModal = ({ isOpen, onClose, onConfirm, taskName }: DeleteTaskModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={!isDeleting ? onClose : undefined}
                aria-hidden="true"
            />
            <div 
                className="relative bg-white dark:bg-[#141416] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-white/10"
                role="dialog"
                aria-modal="true"
            >
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                        <AlertTriangle size={18} />
                        <h2 className="text-[16px] font-semibold tracking-tight">
                            Delete Task
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-50"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-[14px] text-zinc-600 dark:text-zinc-300">
                        Are you sure you want to delete the task <strong>"{taskName}"</strong>? This action cannot be undone.
                    </p>
                </div>
                <div className="px-6 py-4 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/10 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:bg-red-600 text-white text-[13px] font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isDeleting && <Loader2 size={14} className="animate-spin" />}
                        Delete Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTaskModal;
