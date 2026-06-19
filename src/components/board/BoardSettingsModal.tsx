import { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Crown, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateBoard, addMember, removeMember } from '../../api/boardApi';
import useBoardStore from '../../store/useBoardStore';
import type { IBoard } from '../../types';

interface BoardSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    board: IBoard;
}

const BoardSettingsModal = ({ isOpen, onClose, board }: BoardSettingsModalProps) => {
    const { updateCurrentBoard } = useBoardStore();

    const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');

    // General Tab State
    const [title, setTitle] = useState(board.title);
    const [tag, setTag] = useState(board.tag || '');
    const [isSaving, setIsSaving] = useState(false);

    // Members Tab State
    const [email, setEmail] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

    // Reset state when modal opens/closes or board changes
    useEffect(() => {
        if (isOpen) {
            setTitle(board.title);
            setTag(board.tag || '');
            setEmail('');
            setActiveTab('general');
        }
    }, [isOpen, board]);

    if (!isOpen) return null;

    const hasChanges = title.trim() !== board.title || tag.trim() !== (board.tag || '');
    const isSaveDisabled = !hasChanges || isSaving || !title.trim();

    const handleSaveChanges = async () => {
        if (isSaveDisabled) return;

        try {
            setIsSaving(true);
            const { updatedBoard } = await updateBoard(board._id, { title: title.trim(), tag: tag.trim() });
            updateCurrentBoard(updatedBoard);
            toast.success('Board updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update board');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || isAddingMember) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return toast.error("Enter a valid email address");
        }

        if (email.length > 20) {
            return toast.error("Email cannot be more than 20 characters long");
        }

        if (email.length < 5) {
            return toast.error("Email must be at least 5 characters long");
        }
        try {
            setIsAddingMember(true);
            const { updatedBoard } = await addMember(board._id, email.trim());
            updateCurrentBoard(updatedBoard);
            setEmail('');
            toast.success('Member added successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        } finally {
            setIsAddingMember(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        try {
            setRemovingMemberId(userId);
            const { updatedBoard } = await removeMember(board._id, userId);
            updateCurrentBoard(updatedBoard);
            toast.success('Member removed successfully');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to remove member');
        } finally {
            setRemovingMemberId(null);
        }
    };

    // Filter out the owner from the members list
    const filteredMembers = board.members.filter(m => m._id !== board.owner._id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative bg-white dark:bg-[#141416] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-white/10"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                    <h2 className="text-[16px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                        Board Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-zinc-200 dark:border-white/10">
                    <button
                        className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors ${activeTab === 'general'
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        onClick={() => setActiveTab('general')}
                    >
                        General
                    </button>
                    <button
                        className={`py-3 px-4 text-[13px] font-medium border-b-2 transition-colors ${activeTab === 'members'
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                            }`}
                        onClick={() => setActiveTab('members')}
                    >
                        Members
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'general' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Board Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="e.g., Marketing Project"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    Tag <span className="text-zinc-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    maxLength={15}
                                    className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    placeholder="e.g., Q3 Goals"
                                />
                                <p className="text-[12px] text-zinc-500 mt-1.5">
                                    Max 15 characters.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Add Member Form */}
                            <form onSubmit={handleAddMember} className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="User email address"
                                        required
                                        className="w-full px-3 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-lg text-[14px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAddingMember || !email.trim()}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {isAddingMember ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                                    Add
                                </button>
                            </form>

                            {/* Members List */}
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {/* Owner Row */}
                                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        {board.owner.avatar ? (
                                            <img src={board.owner.avatar} alt={board.owner.name} className="w-8 h-8 rounded-full border border-purple-200 dark:border-purple-900" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium text-[13px] border border-purple-200 dark:border-purple-900">
                                                {board.owner.name?.charAt(0).toUpperCase() || 'O'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[13px] font-medium text-zinc-900 dark:text-white">{board.owner.name}</p>
                                            <p className="text-[12px] text-zinc-500">{board.owner.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                                        <Crown size={12} />
                                        Owner
                                    </div>
                                </div>

                                {/* Other Members */}
                                {filteredMembers.map((member) => (
                                    <div key={member._id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-white/5 bg-white dark:bg-[#141416]">
                                        <div className="flex items-center gap-3">
                                            {member.avatar ? (
                                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full border border-zinc-200 dark:border-white/10" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-medium text-[13px] border border-zinc-200 dark:border-white/10">
                                                    {member.name?.charAt(0).toUpperCase() || 'M'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[13px] font-medium text-zinc-900 dark:text-white">{member.name}</p>
                                                <p className="text-[12px] text-zinc-500">{member.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(member._id)}
                                            disabled={removingMemberId === member._id}
                                            className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
                                            title="Remove member"
                                        >
                                            {removingMemberId === member._id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <p className="text-[13px] text-center text-zinc-500 py-4">
                                        No other members yet. Invite someone!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer (Only for General tab's Save action) */}
                {activeTab === 'general' && (
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
                )}
            </div>
        </div>
    );
};

export default BoardSettingsModal;
