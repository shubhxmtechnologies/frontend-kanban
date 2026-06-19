import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = ({ className = '', size = 16 }: { className?: string, size?: number }) => {
    const [dark, setDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('kanban-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('kanban-theme', 'light');
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-lg transition-colors duration-200 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] ${className}`}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {dark
                ? <Sun size={size} aria-hidden="true" />
                : <Moon size={size} aria-hidden="true" />
            }
        </button>
    );
};

export default ThemeToggle;
