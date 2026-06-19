import { useState, useEffect, useRef } from 'react';
import { X, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (boardData: { title: string, tag?: string }) => Promise<void>;
}

const CreateBoardModal = ({ isOpen, onClose, onCreate }: CreateBoardModalProps) => {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setTitle('');
            setTag('');
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return toast.error('Board title is required');

        if (tag.trim().length > 15) return toast.error('Tag must be 15 characters or less');

        setLoading(true);
        try {
            await onCreate({
                title: String(title.trim()),
                tag: tag.trim() || undefined
            });
            setTitle('');
            setTag('');
            onClose();
        } catch {
            // Error is handled by the parent
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full h-10 px-3 rounded-lg text-sm bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors";

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-all"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-board-title"
        >
            {/* Modal card */}
            <div
                className="w-full max-w-[420px] bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] shadow-xl dark:shadow-2xl rounded-xl p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center">
                            <LayoutGrid size={16} className="text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
                        </div>
                        <h2
                            id="create-board-title"
                            className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight"
                        >
                            New board.
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        aria-label="Close modal"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="board-title-input"
                            className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
                        >
                            Board name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="board-title-input"
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. My Project, Q3 Roadmap…"
                            className={inputClasses}
                            autoComplete="off"
                            maxLength={60}
                            required
                        />
                        <div className="flex justify-end">
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                {title.length}/60 characters
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="board-tag-input"
                                className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider"
                            >
                                Tag
                            </label>
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium italic">Optional</span>
                        </div>
                        <input
                            id="board-tag-input"
                            type="text"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            placeholder="e.g. Design, Sprint 1"
                            className={inputClasses}
                            autoComplete="off"
                            maxLength={15}
                        />
                        <div className="flex justify-end">
                            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                {tag.length}/15 characters
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-10 px-4 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="flex-1 h-10 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
                        >
                            {loading ? 'Creating…' : 'Create board'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;