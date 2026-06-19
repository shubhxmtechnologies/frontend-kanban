import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { IBoard } from '../../types';
import { formatDate } from "../../helpers/dateFormat"
import useAuthStore from '../../store/useAuthStore';

// Gradient accent colors per board
const GRADIENT_ACCENTS = [
    'linear-gradient(135deg, #007cf0, #00dfd8)',
    'linear-gradient(135deg, #7928ca, #ff0080)',
    'linear-gradient(135deg, #ff4d4d, #f9cb28)',
    'linear-gradient(135deg, #0070f3, #7928ca)',
    'linear-gradient(135deg, #00dfd8, #f9cb28)',
    'linear-gradient(135deg, #ff0080, #ff4d4d)',
];

interface BoardCardProps {
    board: IBoard;
    onDelete: (id: string) => void;
    index?: number;
}

const BoardCard = ({ board, onDelete, index = 0 }: BoardCardProps) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const isOwner = user?._id === board.owner?._id;
    const accent = GRADIENT_ACCENTS[index % GRADIENT_ACCENTS.length];

    // Combine owner and members, removing any duplicates by _id
    const allMembers = [board.owner, ...(board.members || [])].filter((v, i, a) => a.findIndex(t => t?._id === v?._id) === i).filter(Boolean);
    const displayMembers = allMembers.slice(0, 3);
    const remainingCount = allMembers.length - 3;



    return (
        <article
            className="group relative flex flex-col cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500 bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl overflow-hidden min-h-[160px] shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-purple-500/50"
            onClick={() => navigate(`/board/${board._id}`)}
        >
            {/* Gradient accent bar */}
            <div
                style={{ height: '4px', background: accent, flexShrink: 0 }}
                aria-hidden="true"
            />

            {/* Card body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1.5 gap-2">
                            <h2
                                className="min-w-0 truncate text-base font-bold text-zinc-900 dark:text-white"
                                title={board.title}
                            >
                                {board.title}
                            </h2>
                            {board.tag && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-600 dark:bg-white/[0.04] dark:text-zinc-400 shrink-0 mt-0.5">
                                    {board.tag}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            Created at {formatDate(board.createdAt)}.
                        </p>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Footer row */}
                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/[0.06] pt-3 mt-auto">
                    {/* Avatars */}
                    <div className="flex items-center -space-x-2">
                        {displayMembers.map((m, i) => (
                            <div key={m._id || i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#141416] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                {m.avatar ? (
                                    <img src={m.avatar} alt={m.name || "User"} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-500">{m.name?.charAt(0) || "U"}</div>
                                )}
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#141416] bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                                +{remainingCount}
                            </div>
                        )}
                    </div>

                    {/* Delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) onDelete(board._id);
                        }}
                        disabled={!isOwner}
                        title={!isOwner ? "Only the board owner can delete this board" : `Delete board "${board.title}"`}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-zinc-400"
                        aria-label={!isOwner ? "Delete disabled" : `Delete board "${board.title}"`}
                    >
                        <Trash2 size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default BoardCard;