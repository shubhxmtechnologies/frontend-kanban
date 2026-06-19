import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Sparkles, Search } from 'lucide-react';
import { getBoards, createBoard, deleteBoard } from '../api/boardApi';
import useBoardStore from '../store/useBoardStore';
import BoardCard from '../components/board/BoardCard';
import CreateBoardModal from '../components/board/CreateBoardModal';
import toast from 'react-hot-toast';
import socket from '../socket/socket';
import useAuthStore from '../store/useAuthStore';

const BoardSkeleton = () => (
    <div
        className="rounded-xl h-[160px] bg-zinc-100 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] animate-pulse"
    />
);

const DashboardPage = () => {
    const { boards, setBoards, addBoard, removeBoard } = useBoardStore();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const data = await getBoards();

                setBoards(data);
            } catch {
                toast.error('Failed to load boards');
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, [setBoards]);

    // Socket: listen for board membership changes
    useEffect(() => {
        const { user } = useAuthStore.getState();
        if (!user) return;
        
        if (!socket.connected) {
            socket.connect();
        }
        
        // Listen for being added to a board
        socket.on('board:member-added', ({ board }) => {
            if (board) {
                // Re-fetch boards to get the latest list
                getBoards().then(data => setBoards(data)).catch(() => {});
                toast.success(`You were added to board: ${board.title}`);
            }
        });
        
        // Listen for being removed from a board
        socket.on('board:member-removed', ({ boardId, removedUserId }) => {
            if (removedUserId === user._id) {
                removeBoard(boardId);
                toast.success('You were removed from a board');
            }
        });
        
        return () => {
            socket.off('board:member-added');
            socket.off('board:member-removed');
        };
    }, [setBoards, removeBoard]);

    const handleCreateBoard = async (boardData: { title: string, tag?: string }) => {
        const newBoard = await createBoard(boardData);

        addBoard(newBoard.board);
        toast.success(newBoard.message);
    };

    const handleDeleteBoard = (boardId: string) => {
        setBoardToDelete(boardId);
    };

    const confirmDelete = async () => {
        if (!boardToDelete) return;
        setIsDeleting(true);
        try {
            await deleteBoard(boardToDelete);
            removeBoard(boardToDelete);
            toast.success('Board deleted');
        } catch {
            toast.error('Failed to delete board');
        } finally {
            setIsDeleting(false);
            setBoardToDelete(null);
        }
    };

    // Filter boards based on search query
    const filteredBoards = boards.filter(b =>

        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tag?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full">
            <main
                id="main-content"
                className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl mx-auto"
            >
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8 sm:mb-10">
                    <div className="min-w-0">
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5">Workspace</p>
                        <h1 className="truncate text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white leading-[40px]">
                            My Boards.
                        </h1>
                        <p className="mt-1 hidden sm:block text-sm text-zinc-500 dark:text-zinc-400">
                            {boards.length > 0
                                ? `${boards.length} board${boards.length === 1 ? '' : 's'} in your workspace`
                                : 'Your workspace is empty — create your first board.'
                            }
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4" />
                            <input
                                type="text"
                                placeholder="Search boards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-9 pr-3 rounded-lg text-sm bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors shadow-sm"
                            />
                        </div>

                        {/* Create Board Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-1.5 px-4 h-9 w-full sm:w-auto shrink-0 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
                            aria-label="Create a new board"
                        >
                            <Plus size={16} aria-hidden="true" />
                            <span>New Board</span>
                        </button>
                    </div>
                </div>

                {/* Board grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {[...Array(6)].map((_, i) => <BoardSkeleton key={i} />)}
                    </div>
                ) : boards.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center text-center bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl py-16 px-6 min-h-[280px] shadow-sm"
                    >
                        <div
                            className="w-[52px] h-[52px] rounded-full bg-zinc-100 dark:bg-white/[0.04] flex items-center justify-center mb-5"
                            aria-hidden="true"
                        >
                            <LayoutGrid size={24} className="text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <h2 className="text-[18px] font-bold tracking-[-0.03em] text-zinc-900 dark:text-white mb-2">
                            No boards yet.
                        </h2>
                        <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-6 max-w-[280px]">
                            Create your first board and start organising your work with Kanban.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
                        >
                            <Sparkles size={16} aria-hidden="true" />
                            Create first board
                        </button>
                    </div>
                ) : filteredBoards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <p className="text-zinc-500 dark:text-zinc-400">No boards match your search query.</p>
                        <button onClick={() => setSearchQuery('')} className="mt-2 text-sm text-purple-600 hover:underline">Clear search</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {filteredBoards.map((board, idx) => (
                            <BoardCard key={board._id} board={board} onDelete={handleDeleteBoard} index={idx} />
                        ))}
                        {/* Ghost add card */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="group flex flex-col items-center justify-center gap-2 rounded-xl border-dashed border-2 min-h-[160px] border-zinc-200 dark:border-white/[0.1] bg-transparent text-zinc-400 dark:text-zinc-500 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
                            aria-label="Create a new board"
                        >
                            <Plus size={24} aria-hidden="true" className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="text-[14px] font-medium">New board</span>
                        </button>
                    </div>
                )}
            </main>

            <CreateBoardModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateBoard}
            />

            {/* Delete Confirmation Modal */}
            {boardToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-all"
                    onClick={() => setBoardToDelete(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-board-title"
                >
                    <div
                        className="w-full max-w-[400px] bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] shadow-xl dark:shadow-2xl rounded-xl p-6 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="delete-board-title" className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                            Delete Board
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                            Are you sure you want to delete this board? All lists, tasks, and data inside it will be permanently removed. This action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => setBoardToDelete(null)}
                                disabled={isDeleting}
                                className="flex-1 h-10 px-4 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 h-10 px-4 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;