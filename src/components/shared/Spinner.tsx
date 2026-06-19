import { Menu } from 'lucide-react';

export default function Spinner({ showSideBar = true }: { showSideBar?: boolean }) {
    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0a0a0c] transition-colors duration-300">
            {/* Desktop Sidebar Skeleton */}
            {showSideBar && <aside className="hidden md:block w-64 h-full shrink-0 border-r border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0a0a0c]">
                <div className="flex flex-col h-full">
                    {/* Top: Logo & Workspace */}
                    <div className="h-16 px-5 flex items-center shrink-0 border-b border-zinc-200 dark:border-white/[0.06]">
                        <div className='h-8 w-8 rounded-full bg-zinc-200 dark:bg-white/[0.08] animate-pulse' />
                        <div className="ml-2.5 h-4 w-24 bg-zinc-200 dark:bg-white/[0.08] rounded animate-pulse" />
                    </div>

                    {/* Links */}
                    <div className="flex-1 py-5 px-3 flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                                <div className="size-5 rounded bg-zinc-200 dark:bg-white/[0.08] animate-pulse shrink-0" />
                                <div className="h-4 w-20 bg-zinc-200 dark:bg-white/[0.08] rounded animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {/* Bottom */}
                    <div className="p-3 border-t border-zinc-200 dark:border-white/[0.06] flex flex-col gap-2">
                        <div className="flex items-center justify-between px-3 py-2">
                            <div className="h-4 w-12 bg-zinc-200 dark:bg-white/[0.08] rounded animate-pulse" />
                            <div className="h-5 w-10 bg-zinc-200 dark:bg-white/[0.08] rounded-full animate-pulse" />
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2.5">
                            <div className="size-5 rounded bg-zinc-200 dark:bg-white/[0.08] animate-pulse shrink-0" />
                            <div className="h-4 w-16 bg-zinc-200 dark:bg-white/[0.08] rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </aside>}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Mobile Header Skeleton */}
                <header className="md:hidden h-14 border-b border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0a0a0c] flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 -ml-1.5 rounded-lg text-zinc-300 dark:text-zinc-700">
                            <Menu size={20} />
                        </div>
                        <div className='h-8 w-8 rounded-full bg-zinc-200 dark:bg-white/[0.08] animate-pulse' />
                        <div className="h-4 w-24 bg-zinc-200 dark:bg-white/[0.08] rounded animate-pulse" />                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-white dark:bg-[#0a0a0c] p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8 w-full">
                        {/* Welcome Banner Skeleton */}
                        <div className="h-32 sm:h-40 rounded-2xl bg-zinc-100 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] animate-pulse" />

                        {/* Stats Grid Skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-28 rounded-xl bg-zinc-100 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] animate-pulse" />
                            ))}
                        </div>

                        {/* Main Grid Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 h-64 rounded-xl bg-zinc-100 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] animate-pulse" />
                            <div className="h-64 rounded-xl bg-zinc-100 dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] animate-pulse" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}