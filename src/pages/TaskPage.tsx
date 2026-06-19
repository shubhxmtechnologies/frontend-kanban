import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask, updateTask } from '../api/taskApi';
import { getComments, createComment, updateComment, deleteComment } from '../api/commentApi';
import { Settings, ArrowLeft, CheckCircle2, Circle, MessageSquare, Clock, Send, Loader2, Pencil, Trash2, X, Check, Tag, Users, LayoutList, CalendarDays, Flag } from 'lucide-react';
import Spinner from '../components/shared/Spinner';
import socket from '../socket/socket';
import type { ITask, IComment } from '../types';
import UpdateTaskModal from '../components/kanban/UpdateTaskModal';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { formatSmartDate } from '../helpers/dateFormat';

const priorityConfig = {
    high: { label: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/20', dot: 'bg-red-500' },
    medium: { label: 'Medium', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', dot: 'bg-amber-500' },
    low: { label: 'Low', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500' },
};

const TaskPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [task, setTask] = useState<ITask | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Comments state
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getTask(id);
                setTask(data);
            } catch (err) {
                setError('Failed to load task details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!id) return;
            try {
                setCommentsLoading(true);
                const data = await getComments(id);
                setComments(data);
            } catch (err) {
                console.error('Failed to fetch comments', err);
            } finally {
                setCommentsLoading(false);
            }
        };
        fetchComments();
    }, [id]);

    useEffect(() => {
        if (!task?.board) return;
        const boardId = typeof task.board === 'string' ? task.board : task.board;

        if (!socket.connected) {
            socket.connect();
        }
        socket.emit('join-board', boardId);

        // Listen for task updates
        socket.on('task-updated', ({ task: updatedTask, user }) => {
            if (updatedTask._id === id) {
                setTask(updatedTask);
                toast.success(`${user.name} updated this task`);
            }
        });

        // Listen for comment events
        socket.on('comment-created', ({ comment, user }) => {
            if (comment.task === id || comment.task?._id === id) {
                setComments(prev => {
                    const exists = prev.some(c => c._id === comment._id);
                    if (exists) return prev;
                    return [comment, ...prev];
                });
                toast.success(`${user.name} added a comment`);
            }
        });

        socket.on('comment-updated', ({ comment, user }) => {
            if (comment.task === id || comment.task?._id === id) {
                setComments(prev => prev.map(c => c._id === comment._id ? comment : c));
                toast.success(`${user.name} edited a comment`);
            }
        });

        socket.on('comment-deleted', ({ commentId, taskId, user }) => {
            if (taskId === id || taskId?._id === id) {
                setComments(prev => prev.filter(c => c._id !== commentId));
                toast.success(`${user.name} deleted a comment`);
            }
        });

        return () => {
            socket.off('task-updated');
            socket.off('comment-created');
            socket.off('comment-updated');
            socket.off('comment-deleted');
            socket.emit('leave-board', boardId);
        };
    }, [task?.board, id]);

    const handleUpdateTask = async (taskId: string, taskData: any) => {
        try {
            const updatedTask = await updateTask(taskId, taskData);
            setTask(updatedTask);
            toast.success("Task updated successfully");
        } catch (err) {
            toast.error("Failed to update task");
            throw err;
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !newComment.trim()) return;
        setIsSubmitting(true);
        try {
            const comment = await createComment(id, newComment.trim());
            setComments(prev => [comment, ...prev]);
            setNewComment('');
        } catch (err) {
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (!editText.trim()) return;
        try {
            const updated = await updateComment(commentId, editText.trim());
            setComments(prev => prev.map(c => c._id === commentId ? updated : c));
            setEditingId(null);
            setEditText('');
        } catch (err) {
            toast.error("Failed to edit comment");
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        setDeletingId(commentId);
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            toast.error("Failed to delete comment");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <Spinner showSideBar={false} />;

    if (error || !task) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-zinc-500 mb-4">{error || 'Task not found'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const pConfig = task.priority ? priorityConfig[task.priority] : null;

    return (
        <div className="h-screen flex flex-col bg-zinc-50 dark:bg-[#0a0a0a] overflow-y-auto">
            {/* ─── Header ─── */}
            <div className="sticky top-0 z-10 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-[#141416]/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="h-5 w-px bg-zinc-200 dark:bg-white/10" />
                    <h1 className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                        {task.title}
                    </h1>
                    {task.completed ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                            <CheckCircle2 size={12} /> Done
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-white/8 dark:text-zinc-400">
                            <Circle size={12} /> Active
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    aria-label="Task settings"
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* ─── Body: Two-column layout ─── */}
            <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

                {/* ─── LEFT COLUMN: Main content + comments ─── */}
                <div className="space-y-6 min-w-0">

                    {/* Title & Description Card */}
                    <div className="bg-white dark:bg-[#141416] rounded-2xl border border-zinc-200 dark:border-white/8 shadow-sm overflow-hidden">
                        {/* Color accent bar */}
                        <div className="h-1" style={{ backgroundColor: task.color || '#a855f7' }} />
                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight mb-3">
                                {task.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-400 mb-6">
                                {task.createdAt && (
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays size={12} />
                                        Created {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                )}
                                {task.updatedAt && task.updatedAt !== task.createdAt && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        Updated {formatSmartDate(task.updatedAt)}
                                    </span>
                                )}
                            </div>

                            {task.description ? (
                                <p className="text-[14px] text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                                    {task.description}
                                </p>
                            ) : (
                                <p className="text-[14px] text-zinc-400 dark:text-zinc-600 italic">No description provided.</p>
                            )}
                        </div>
                    </div>

                    {/* ─── Comments ─── */}
                    <div className="bg-white dark:bg-[#141416] rounded-2xl border border-zinc-200 dark:border-white/8 shadow-sm overflow-hidden">
                        <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex items-center justify-between">
                            <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-purple-500" /> Discussion
                            </h3>
                            <span className="text-xs text-zinc-400 font-medium bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                                {comments.length} comment{comments.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Comment input */}
                        <div className="px-6 md:px-8 pb-6">
                            <form onSubmit={handleAddComment} className="flex gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="text-white font-bold text-xs">
                                        {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={isSubmitting}
                                        placeholder="Write a comment..."
                                        className="flex-1 px-3.5 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 disabled:opacity-50 transition-shadow"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newComment.trim()}
                                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-sm"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-zinc-100 dark:border-white/5" />

                        {/* Comments list */}
                        <div className="px-6 md:px-8 py-5">
                            {commentsLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 size={22} className="animate-spin text-zinc-300" />
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                                        <MessageSquare size={20} className="text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                    <p className="text-[13px] text-zinc-400">No comments yet. Start the conversation!</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {comments.map(comment => (
                                        <div key={comment._id} className="flex gap-3 group">
                                            <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                {comment.author.avatar ? (
                                                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-zinc-500 dark:text-zinc-400 font-semibold text-xs uppercase">
                                                        {(comment.author.name || comment.author.email || '?').charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-semibold text-zinc-900 dark:text-white text-[13px]">
                                                        {comment.author.name || comment.author.email}
                                                    </span>
                                                    <span className="text-[11px] text-zinc-400">
                                                        {formatSmartDate(comment.createdAt)}
                                                    </span>
                                                    {comment.updatedAt !== comment.createdAt && (
                                                        <span className="text-[10px] text-zinc-400 italic">(edited)</span>
                                                    )}
                                                </div>

                                                {editingId === comment._id ? (
                                                    <div className="flex gap-2 mt-1">
                                                        <input
                                                            type="text"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            autoFocus
                                                            className="flex-1 px-3 py-1.5 bg-white dark:bg-black/40 border border-purple-300 dark:border-purple-500/30 rounded-lg text-[13px] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleEditComment(comment._id);
                                                                if (e.key === 'Escape') { setEditingId(null); setEditText(''); }
                                                            }}
                                                        />
                                                        <button onClick={() => handleEditComment(comment._id)} disabled={!editText.trim()} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg disabled:opacity-50"><Check size={15} /></button>
                                                        <button onClick={() => { setEditingId(null); setEditText(''); }} className="p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg"><X size={15} /></button>
                                                    </div>
                                                ) : (
                                                    <p className="text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                                        {comment.text}
                                                    </p>
                                                )}

                                                {user && comment.author._id === user._id && editingId !== comment._id && (
                                                    <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setEditingId(comment._id); setEditText(comment.text); }} className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded" title="Edit"><Pencil size={12} /></button>
                                                        <button onClick={() => handleDeleteComment(comment._id)} disabled={deletingId === comment._id} className="p-1 text-zinc-400 hover:text-red-500 rounded disabled:opacity-50" title="Delete">{deletingId === comment._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT COLUMN: Sidebar meta ─── */}
                <aside className="space-y-4 lg:sticky lg:top-[72px]">

                    {/* Priority */}
                    {pConfig && (
                        <div className={`rounded-xl border p-4 ${pConfig.bg} ${pConfig.border}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <Flag size={14} className={pConfig.color} />
                                <span className={`text-[12px] font-semibold uppercase tracking-wider ${pConfig.color}`}>Priority</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className={`w-2 h-2 rounded-full ${pConfig.dot}`} />
                                <span className={`text-[14px] font-bold ${pConfig.color}`}>{pConfig.label}</span>
                            </div>
                        </div>
                    )}

                    {/* List Info */}
                    <div className="bg-white dark:bg-[#141416] rounded-xl border border-zinc-200 dark:border-white/8 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <LayoutList size={14} className="text-zinc-400" />
                            <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">List</span>
                        </div>
                        {task.list ? (
                            <div>
                                <p className="text-[14px] font-semibold text-zinc-900 dark:text-white">{task.list.title}</p>
                                {task.list.description && (
                                    <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed">{task.list.description}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-[13px] text-zinc-400 italic">Unknown list</p>
                        )}
                    </div>

                    {/* Labels */}
                    {task.labels && task.labels.length > 0 && (
                        <div className="bg-white dark:bg-[#141416] rounded-xl border border-zinc-200 dark:border-white/8 p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag size={14} className="text-zinc-400" />
                                <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Labels</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {task.labels.map(label => (
                                    <span key={label} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assignees */}
                    <div className="bg-white dark:bg-[#141416] rounded-xl border border-zinc-200 dark:border-white/8 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Users size={14} className="text-zinc-400" />
                            <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Assignees</span>
                        </div>
                        {task.assignedTo && task.assignedTo.length > 0 ? (
                            <div className="space-y-2">
                                {task.assignedTo.map(assignee => (
                                    <div key={assignee._id} className="flex items-center gap-2.5 p-2 -mx-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                                        <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                                            {assignee.avatar ? (
                                                <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-bold">
                                                    {(assignee.name || assignee.email || '?').charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-zinc-900 dark:text-white truncate leading-tight">
                                                {assignee.name || 'Unnamed'}
                                            </p>
                                            <p className="text-[11px] text-zinc-400 truncate leading-tight">
                                                {assignee.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[13px] text-zinc-400 italic">No assignees</p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="bg-white dark:bg-[#141416] rounded-xl border border-zinc-200 dark:border-white/8 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={14} className="text-zinc-400" />
                            <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${task.completed ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
                            <span className={`text-[14px] font-semibold ${task.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-300'}`}>
                                {task.completed ? 'Completed' : 'In Progress'}
                            </span>
                        </div>
                    </div>
                </aside>
            </div>

            <UpdateTaskModal
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                task={task}
                onUpdate={handleUpdateTask}
            />
        </div>
    );
};

export default TaskPage;
