import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import useBoardStore from '../../store/useBoardStore';

interface AddListFormProps {
    onAdd: (title: string, description?: string) => void;
}

const AddListForm = ({ onAdd }: AddListFormProps) => {
    const { isAddListFormOpen: isOpen, setIsAddListFormOpen: setIsOpen } = useBoardStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd(trimmed, description.trim() || undefined);
        setTitle('');
        setDescription('');
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setTitle('');
            setDescription('');
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl transition-all duration-150 hover:bg-zinc-100 dark:hover:bg-[#1c1c1f] hover:shadow-sm bg-zinc-50 dark:bg-white/[0.02] border border-dashed border-zinc-300 dark:border-white/[0.1] text-zinc-500 dark:text-zinc-400 text-[13px] font-medium px-4 py-2.5 min-w-[280px] w-[280px] whitespace-nowrap"
                aria-label="Add a new list"
            >
                <Plus size={16} aria-hidden="true" className="text-zinc-400 dark:text-zinc-500" />
                Add a list
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-3 shrink-0 shadow-md bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-4 min-w-[280px] w-[280px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div>
                    <label
                        htmlFor="add-list-input"
                        className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                        List name
                    </label>
                    <input
                        id="add-list-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. To Do, In Progress…"
                        autoFocus
                        className="w-full h-9 px-3 rounded-lg text-[13px] bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors"
                        autoComplete="off"
                        maxLength={50}
                    />
                </div>
                <div>
                    <label
                        htmlFor="add-list-desc"
                        className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                        Description <span className="text-zinc-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        id="add-list-desc"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Short description…"
                        className="w-full h-9 px-3 rounded-lg text-[13px] bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors"
                        autoComplete="off"
                        maxLength={100}
                    />
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <button
                        type="submit"
                        disabled={!title.trim()}
                        className="flex-1 h-8 rounded-lg text-[13px] font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    >
                        Add list
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTitle(''); setIsOpen(false); }}
                        className="flex items-center justify-center h-8 px-2 rounded-lg border border-zinc-200 dark:border-white/[0.1] text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        aria-label="Cancel adding list"
                    >
                        <X size={14} aria-hidden="true" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddListForm;