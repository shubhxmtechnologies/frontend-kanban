import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useBoardStore from '../../store/useBoardStore';
import { BookMarked, LayoutDashboard, LogOut, Menu, Settings, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getMe } from '../../api/authApi';
import Spinner from './Spinner';
export default function DashboardLayout() {
    const { setUser, user, logout } = useAuthStore();
    useEffect(() => {
        const fetchData = async () => {
            const data = await getMe()
            setUser(data)
        }
        fetchData()
    }, [])
    const { clearBoard } = useBoardStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        clearBoard();
        logout();
        navigate('/login');
    };

    const links = [
        { title: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { title: "Boards", path: "/my-boards", icon: BookMarked },
        { title: 'Settings', path: '/settings', icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-[#0a0a0c] border-r border-zinc-200 dark:border-white/[0.06] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            {/* Top: Logo & Workspace */}
            <div className="h-16 px-5 flex items-center shrink-0 border-b border-zinc-200 dark:border-white/[0.06]">
                <img src={user?.avatar} alt={user?.name} className='h-8 w-8 rounded-full' />
                <span className="ml-2.5 text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {user?.name ? `${user?.name.split(" ")[0]}'s Workspace` : 'Workspace'}
                </span>
            </div>

            {/* Links */}
            <div className="flex-1 py-5 px-3 flex flex-col gap-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-white'
                                }`}
                        >
                            <Icon size={18} />
                            {link.title}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom: Theme Toggle & Logout */}
            <div className="p-3 border-t border-zinc-200 dark:border-white/[0.06] flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/[0.04] transition-colors">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Theme</span>
                    <ThemeToggle />
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                >
                    <LogOut size={18} />
                    Log out
                </button>
            </div>
        </div>
    );

    if (!user) {
        return <Spinner />
    }

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0a0a0c] transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 h-full shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative w-64 h-full z-10 flex flex-col shadow-2xl">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 z-50 hover:bg-zinc-300 dark:hover:bg-white/20 transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden h-14 border-b border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0a0a0c] flex items-center justify-between px-4 shrink-0 transition-colors duration-300">
                    <div className="flex w-full justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-1.5 -ml-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/[0.06] transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className='flex items-center gap-2'>
                            <span className=" text-sm font-bold text-zinc-900 dark:text-white truncate">
                                {user?.name ? `${user?.name.split(" ")[0]}'s Workspace` : 'Workspace'}
                            </span>
                            <img src={user?.avatar} alt={user?.name} className='w-8 h-8 rounded-full' />

                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-white dark:bg-[#0a0a0c]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
