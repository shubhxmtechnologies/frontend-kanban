import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBoard } from '../api/boardApi';
import { createList, deleteList } from '../api/listApi';
import { createTask, deleteTask } from '../api/taskApi';
import useBoardStore from '../store/useBoardStore';
import KanbanBoard from '../components/kanban/KanbanBoard';
import BoardSettingsModal from '../components/board/BoardSettingsModal';
import Spinner from '../components/shared/Spinner';
import socket from '../socket/socket';
import toast from 'react-hot-toast';
import { moveTask as moveTaskApi } from '../api/taskApi';
import { ChevronRight, LayoutGrid, Settings, Search, Plus } from 'lucide-react';

const BoardPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentBoard, setCurrentBoard, lists, setLists, tasks, setTasks,
        addList, removeList, addTask, removeTask, updateTaskInStore,
        searchQuery, setSearchQuery, setIsAddListFormOpen } = useBoardStore();
    const [loading, setLoading] = useState(true);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const lowerQuery = (searchQuery || '').toLowerCase();
    const filteredLists = lists.filter(l =>
        (l?.title || '').toLowerCase().includes(lowerQuery) ||
        tasks.some(t => t?.list?._id === l?._id && ((t?.title || '').toLowerCase().includes(lowerQuery) || (t?.description || '').toLowerCase().includes(lowerQuery)))
    );
    const filteredTasks = tasks.filter(t =>
        (t?.title || '').toLowerCase().includes(lowerQuery) ||
        (t?.description || '').toLowerCase().includes(lowerQuery) ||
        (lists.find(l => l?._id === t?.list?._id)?.title || '').toLowerCase().includes(lowerQuery)
    );

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                setLoading(true);
                const data = await getBoard(id);
                setCurrentBoard(data);
                setLists(data.lists);
                setTasks(data.tasks);
                socket.connect();
                socket.emit('join-board', id);
            } catch {
                toast.error('Failed to load board');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
        return () => {
            socket.emit('leave-board', id);
            socket.disconnect();
        };
    }, [id, setCurrentBoard, setLists, setTasks, navigate]);

    useEffect(() => {
        // List events
        socket.on('list-created', ({ list, user }) => {
            addList(list);
            toast.success(`${user.name} created list: ${list.title}`);
        });
        socket.on('list-updated', ({ list, user }) => {
            useBoardStore.getState().updateList(list);
            toast.success(`${user.name} updated list: ${list.title}`);
        });
        socket.on('list-deleted', ({ listId, user }) => {
            removeList(listId);
            toast.success(`${user.name} deleted a list`);
        });

        // Task events
        socket.on('task-created', ({ task, user }) => {
            addTask(task);
            toast.success(`${user.name} created task: ${task.title}`);
        });
        socket.on('task-updated', ({ task, user }) => {
            updateTaskInStore(task);
            toast.success(`${user.name} updated task: ${task.title}`);
        });
        socket.on('task-deleted', ({ taskId, user }) => {
            removeTask(taskId);
            toast.success(`${user.name} deleted a task`);
        });
        socket.on('task-moved', ({ task, user }) => {
            updateTaskInStore(task);
            toast.success(`${user.name} moved task: ${task.title}`);
        });

        // Comment events
        socket.on('comment-created', ({ user }) => {
            toast.success(`${user.name} commented on a task`);
        });
        socket.on('comment-updated', ({ user }) => {
            toast.success(`${user.name} edited a comment`);
        });
        socket.on('comment-deleted', ({ user }) => {
            toast.success(`${user.name} deleted a comment`);
        });

        // Board member events  
        socket.on('board:member-added', ({ addedUser }) => {
            if (id) {
                getBoard(id).then(data => setCurrentBoard(data)).catch(() => { });
            }
            toast.success(`${addedUser.name} was added to the board`);
        });
        socket.on('board:member-removed', ({ user }) => {
            // Re-fetch board to get updated member list
            if (id) {
                getBoard(id).then(data => setCurrentBoard(data)).catch(() => { });
            }
            toast.success(`${user.name} removed a member from the board`);
        });

        return () => {
            socket.off('list-created');
            socket.off('list-updated');
            socket.off('list-deleted');
            socket.off('task-created');
            socket.off('task-updated');
            socket.off('task-deleted');
            socket.off('task-moved');
            socket.off('comment-created');
            socket.off('comment-updated');
            socket.off('comment-deleted');
            socket.off('board:member-added');
            socket.off('board:member-removed');
        };
    }, [addList, removeList, addTask, updateTaskInStore, removeTask, id, setCurrentBoard]);

    const handleAddList = async (title: string, description?: string) => {
        try {
            const newList = await createList(id!, { title, description });
            addList(newList);
            toast.success('List created');
        } catch {
            toast.error('Failed to create list');
        }
    };

    const handleAddTask = async (listId: string, taskData: any) => {
        try {
            const newTask = await createTask(listId, taskData);
            addTask(newTask);
        } catch {
            toast.error('Failed to create task');
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId);
            removeTask(taskId);
        } catch {
            toast.error('Failed to delete task');
        }
    };

    const handleDeleteList = async (listId: string) => {
        try {
            await deleteList(listId);
            removeList(listId);
            toast.success('List deleted');
        } catch {
            toast.error('Failed to delete list');
        }
    };

    const handleMoveTask = async (taskId: string, newListId: string, newPosition: number) => {
        const taskToMove = tasks.find(t => t._id === taskId);
        if (!taskToMove) return;

        const oldListId = taskToMove.list._id;
        const targetList = lists.find(l => l._id === newListId);

        // Optimistically calculate new positions for all affected tasks
        let newTasks = [...tasks];

        if (oldListId !== newListId) {
            newTasks = newTasks.map(t => {
                if (t.list._id === oldListId && t.position > taskToMove.position) {
                    return { ...t, position: t.position - 1 };
                }
                if (t.list._id === newListId && t.position >= newPosition) {
                    return { ...t, position: t.position + 1 };
                }
                return t;
            });
        } else {
            if (newPosition > taskToMove.position) {
                newTasks = newTasks.map(t => {
                    if (t.list._id === oldListId && t.position > taskToMove.position && t.position <= newPosition) {
                        return { ...t, position: t.position - 1 };
                    }
                    return t;
                });
            } else if (newPosition < taskToMove.position) {
                newTasks = newTasks.map(t => {
                    if (t.list._id === oldListId && t.position >= newPosition && t.position < taskToMove.position) {
                        return { ...t, position: t.position + 1 };
                    }
                    return t;
                });
            }
        }

        // Apply changes to the moved task
        newTasks = newTasks.map(t => {
            if (t._id === taskId) {
                return {
                    ...t,
                    list: targetList ? { _id: targetList._id, title: targetList.title, description: targetList.description } : t.list,
                    position: newPosition
                };
            }
            return t;
        });

        // Set store immediately for zero-latency UI update
        setTasks(newTasks.sort((a, b) => a.position - b.position));

        try {
            await moveTaskApi(taskId, { listId: newListId, position: newPosition });
        } catch {
            toast.error('Failed to move task');
            if (id) {
                const data = await getBoard(id);
                setTasks(data.tasks);
            }
        }
    };

    if (loading) return <Spinner showSideBar={false} />;

    return (
        <div className="h-screen flex flex-col min-h-0 bg-zinc-50 dark:bg-black/95">

            {/* Board header / breadcrumb */}
            <div className="border-b px-4 sm:px-6 py-3 sm:py-0 bg-white dark:bg-[#141416] border-zinc-200 dark:border-white/8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full mx-auto sm:h-[63px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Link
                            to="/my-boards"
                            className="flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded shrink-0 transition-colors text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                            style={{ textDecoration: 'none' }}
                        >
                            <LayoutGrid size={14} aria-hidden="true" />
                            <span className="text-[14px] font-medium hidden sm:inline">Boards</span>
                        </Link>

                        <ChevronRight size={14} aria-hidden="true" className="text-zinc-300 dark:text-zinc-600 shrink-0" />

                        <h1 className="min-w-0 truncate text-[14px] font-semibold text-zinc-900 dark:text-white tracking-[-0.01em]">
                            {currentBoard?.board?.title}
                        </h1>

                        <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-600 dark:bg-white/[0.04] dark:text-zinc-400 shrink-0 ml-2">
                            {lists.length} list{lists.length !== 1 ? 's' : ''}
                        </span>
                        <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[12px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-600 dark:bg-white/[0.04] dark:text-zinc-400 shrink-0 ml-1">
                            {tasks.length} card{tasks.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto'>
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-[200px] h-8 pl-8 pr-3 rounded-lg bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-purple-500 focus:bg-white dark:focus:bg-[#141416] text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddListFormOpen(true)}
                            className="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-medium transition-colors shrink-0"
                        >
                            <Plus size={14} />
                            <span className="hidden sm:inline">Add List</span>
                        </button>
                        <Settings
                            className='h-[30px] w-[30px] hover:bg-zinc-100 dark:hover:bg-white/10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white p-1.5 rounded-lg cursor-pointer transition-colors shrink-0'
                            onClick={() => setIsSettingsModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Kanban area */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard
                    lists={filteredLists}
                    tasks={filteredTasks}
                    onAddList={handleAddList}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    onDeleteList={handleDeleteList}
                    onMoveTask={handleMoveTask}
                />
            </div>

            {currentBoard && (
                <BoardSettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    board={currentBoard.board}
                />
            )}
        </div>
    );
};

export default BoardPage;