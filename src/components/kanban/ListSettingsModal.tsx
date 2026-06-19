import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateList } from '../../api/listApi';
import type { IList } from '../../types';
import useBoardStore from '../../store/useBoardStore';

interface ListSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    list: IList;
}

const ListSettingsModal = ({ isOpen, onClose, list }: ListSettingsModalProps) => {
    const [title, setTitle] = useState(list.title);
    const [description, setDescription] = useState(list.description || '');
    const [isSaving, setIsSaving] = useState(false);

    const { setLists, lists } = useBoardStore();

    useEffect(() => {
        if (isOpen) {
            setTitle(list.title);
            setDescription(list.description || '');
        }
    }, [isOpen, list]);

    if (!isOpen) return null;

    const hasChanges = title.trim() !== list.title || description.trim() !== (list.description || '');
    const isSaveDisabled = !hasChanges || isSaving || !title.trim();

    const handleSaveChanges = async () => {
        if (isSaveDisabled) return;

        try {
            setIsSaving(true);
            await updateList(list._id, { title: title.trim(), description: description.trim() });

            // Assuming updatedList is returned properly by backend, but the backend is currently returning { list, message } or similar.
            // Wait, listController.ts updateList returns: res.json({ list: updatedList, message: "List updated successfully" }) 
            // Wait, let's verify what `updateList` in `listController.ts` returns! 
            // Ah, the frontend `updateList` API returns `data`. 

            // Optimistic update in store just to be safe
            setLists(lists.map(l => l._id === list._id ? { ...l, title: title.trim(), description: description.trim() } : l));

            toast.success('List updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update list');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className="relative bg-white dark:bg-[#141416] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-white/10"
                role="dialog"
                aria-modal="true"
            >
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                    <h2 className="text-[16px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                        List Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                            List Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            placeholder="e.g., To Do"
                        />
                    </div>
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
                </div>
                <div className="px-6 py-4 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/10 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-[13px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        disabled={isSaveDisabled}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:bg-purple-600 text-white text-[13px] font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListSettingsModal;
