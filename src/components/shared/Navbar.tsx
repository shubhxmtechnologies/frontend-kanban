import { useNavigate, Link } from 'react-router-dom';
import { LogOut, LayoutGrid } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    return (
        <header
            className="sticky top-0 z-40 border-b"
            style={{
                backgroundColor: 'var(--color-canvas)',
                borderColor: 'var(--color-hairline)',
                height: '60px',
            }}
        >
            <div
                className="h-full flex items-center justify-between px-4 sm:px-6"
                style={{ maxWidth: '1280px', margin: '0 auto' }}
            >
                <button
                    onClick={() => navigate('/dashboard')}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] rounded"
                    aria-label="Go to dashboard"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
                >
                    <Logo size={20} textSize="15px" />
                </button>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme Toggle */}
                    <ThemeToggle size={16} />

                    {/* Boards link — text hidden on mobile, icon only */}
                    <Link
                        to="/dashboard"
                        className="btn-nav-ghost flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] rounded"
                        aria-label="My boards"
                        style={{ color: 'var(--color-body)' }}
                    >
                        <LayoutGrid size={14} aria-hidden="true" />
                        <span className="hidden sm:inline">Boards</span>
                    </Link>

                    {/* Separator */}
                    <div
                        style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-hairline)', flexShrink: 0 }}
                        aria-hidden="true"
                    />

                    {/* User avatar + name */}
                    {user && (
                        <div className="flex items-center gap-2" title={user.name || user.email}>
                            <span
                                aria-hidden="true"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '9999px',
                                    backgroundColor: 'var(--color-ink)',
                                    color: 'var(--color-on-primary)',
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.02em',
                                    flexShrink: 0,
                                }}
                            >
                                {initials}
                            </span>
                            {/* Name — hidden below md */}
                            <span
                                className="hidden md:block min-w-0 truncate"
                                style={{ fontSize: '13px', color: 'var(--color-body)', maxWidth: '120px' }}
                            >
                                {user.name || user.email}
                            </span>
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="btn-nav-ghost flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] rounded"
                        aria-label="Log out"
                        title="Log out"
                        style={{ color: 'var(--color-body)', padding: '4px 8px' }}
                    >
                        <LogOut size={14} aria-hidden="true" />
                        <span className="hidden sm:inline" style={{ fontSize: '13px' }}>Log out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;