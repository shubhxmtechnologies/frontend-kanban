import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Zap, Users2, GripVertical, CheckCircle2 } from 'lucide-react';
import Logo from '../components/shared/Logo';
import ThemeToggle from '../components/shared/ThemeToggle';
import useAuthStore from '../store/useAuthStore';

/* ── Board preview data ─────────────────────────────────────────────────────── */
const boardMockup = [
  {
    list: 'Backlog',
    dot: '#a78bfa',
    tasks: [
      { title: 'API rate-limiting', tag: 'Backend', tagColor: '#dbeafe', tagText: '#1e40af' },
      { title: 'Dark mode tokens', tag: 'Design', tagColor: '#fce7f3', tagText: '#9d174d' },
    ],
  },
  {
    list: 'In Progress',
    dot: '#863bff',
    tasks: [
      { title: 'Real-time socket events', tag: 'Feature', tagColor: '#ede9fe', tagText: '#6d28d9', active: true },
      { title: 'Drag & drop reorder', tag: 'UI', tagColor: '#e0f2fe', tagText: '#0369a1' },
    ],
  },
  {
    list: 'Review',
    dot: '#38bdf8',
    tasks: [
      { title: 'Auth middleware tests', tag: 'Testing', tagColor: '#d1fae5', tagText: '#065f46' },
    ],
  },
  {
    list: 'Done ✓',
    dot: '#34d399',
    tasks: [
      { title: 'Project scaffold', tag: 'Setup', tagColor: '#fef3c7', tagText: '#92400e' },
      { title: 'JWT auth flow', tag: 'Auth', tagColor: '#fee2e2', tagText: '#991b1b' },
    ],
  },
];

const LandingPage = () => {

  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="bg-white dark:bg-[#0a0a0c] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">

      {/* ══════════════════════ NAV ══════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 dark:border-white/[0.06] bg-white/90 dark:bg-[#0a0a0c]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-14 px-5 sm:px-8 max-w-[1180px] mx-auto">
          <Logo size={18} textSize="14px" />

          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {['Features', 'How it works'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-[13px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 tracking-[-0.01em]"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="text-[13px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors duration-200 px-2">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-[13px] font-medium text-white dark:text-[#0a0a0c] bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-200 px-3.5 py-1.5 rounded-md transition-colors duration-200 no-underline"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative pt-32 sm:pt-40 pb-4 px-5 sm:px-8">

        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 right-[-15%] w-[600px] h-[600px] rounded-full opacity-10 dark:opacity-30" style={{ background: 'radial-gradient(circle, #863bff 0%, transparent 70%)', filter: 'blur(120px)' }} />
          <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-8 dark:opacity-20" style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)', filter: 'blur(100px)' }} />
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative z-10 max-w-[720px] mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6 justify-center sm:justify-start">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.12em] font-medium">Open source & free</span>
          </div>

          {/* Headline */}
          <h1 className="text-center sm:text-left mb-5 font-extrabold text-zinc-900 dark:text-white" style={{ fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: 1.0, letterSpacing: '-0.045em' }}>
            Stop managing tasks.
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #863bff 40%, #38bdf8 100%)' }}>
              Start shipping.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-center sm:text-left text-zinc-500 dark:text-zinc-400 mb-8 max-w-[440px] mx-auto sm:mx-0 text-[16px] leading-[26px] tracking-[-0.01em]">
            A kanban board your whole team actually wants to use. Real&#8209;time sync, drag&#8209;and&#8209;drop, zero&nbsp;friction.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 h-11 px-5 rounded-lg font-semibold text-sm text-white no-underline transition-all duration-200 hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
            >
              Start for free
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-all duration-200 no-underline"
            >
              Sign in →
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-[12px] text-zinc-400 dark:text-zinc-600 text-center sm:text-left tracking-[-0.01em]">
            No credit card · Free forever · Set up in 2 minutes
          </p>
        </div>

        {/* ── Board preview ─────────────────────────────────────────────────── */}
        <div className="relative z-10 mt-14 sm:mt-20 max-w-[980px] mx-auto">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-3xl pointer-events-none opacity-20 dark:opacity-40"
            style={{ background: 'radial-gradient(ellipse, rgba(134,59,255,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }}
            aria-hidden="true"
          />

          <div className="relative rounded-xl border border-zinc-200 dark:border-white/[0.08] overflow-hidden shadow-2xl dark:shadow-none" style={{ boxShadow: undefined }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/[0.06] px-4 h-9 bg-zinc-50 dark:bg-[#111113]" aria-hidden="true">
              <span className="flex gap-1.5">
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <span key={c} className="w-2 h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.7 }} />
                ))}
              </span>
              <div className="flex-1 flex justify-center">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] rounded px-3 py-0.5">
                  kanbanboard.app/board/my-project
                </span>
              </div>
              <div className="w-[52px]" />
            </div>

            {/* App top bar */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/[0.06] px-4 h-10 bg-white dark:bg-[#0e0e10]" aria-hidden="true">
              <div className="flex items-center gap-2">
                <Logo size={12} textSize="11px" />
                <span className="text-[10px] text-zinc-300 dark:text-zinc-600">/</span>
                <span className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">My Project</span>
              </div>
              <div className="flex items-center gap-1.5">
                {['ML', 'AK', 'SR'].map((a, i) => (
                  <span key={a} className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white border border-white/10" style={{ backgroundColor: ['#863bff', '#38bdf8', '#34d399'][i] }}>{a}</span>
                ))}
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 ml-1">+2</span>
              </div>
            </div>

            {/* Board columns */}
            <div className="flex gap-2.5 overflow-x-auto p-3 bg-zinc-50 dark:bg-[#0c0c0e] min-h-[220px]" style={{ scrollbarWidth: 'none' }} aria-label="Kanban board preview">
              {boardMockup.map((col) => (
                <div key={col.list} className="bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.06] rounded-lg min-w-[175px] w-[175px] shrink-0 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 h-9 border-b border-zinc-100 dark:border-white/[0.04]">
                    <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ backgroundColor: col.dot }} />
                    <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 flex-1 truncate">{col.list}</span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">{col.tasks.length}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 p-1.5">
                    {col.tasks.map((task) => (
                      <div
                        key={task.title}
                        className="group rounded-md px-2.5 py-2 transition-colors duration-150"
                        style={{
                          backgroundColor: task.active ? 'rgba(134,59,255,0.06)' : undefined,
                          border: `1px solid ${task.active ? 'rgba(134,59,255,0.2)' : 'transparent'}`,
                        }}
                      >
                        <div className="flex items-start gap-1.5 mb-1.5">
                          <GripVertical size={10} className="text-zinc-300 dark:text-zinc-700 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 leading-4 break-words flex-1">{task.title}</p>
                        </div>
                        <span className="inline-block text-[9px] font-semibold rounded px-1.5 py-0.5 ml-4" style={{ backgroundColor: task.tagColor, color: task.tagText }}>{task.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Fade */}
        <div className="h-24 bg-gradient-to-b from-transparent to-white dark:to-[#0a0a0c]" aria-hidden="true" />
      </section>

      {/* ══════════════════════ FEATURES ══════════════════════ */}
      <section id="features" className="relative py-20 sm:py-28 px-5 sm:px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-300 dark:to-zinc-700" />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.12em] font-semibold">Why teams switch</span>
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-300 dark:to-zinc-700" />
          </div>

          <h2 className="text-center mb-14 sm:mb-20 font-extrabold text-zinc-900 dark:text-white" style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            The board that keeps up
            <br className="hidden sm:block" />
            {' '}with your team.
          </h2>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Card 1 — large */}
            <div className="md:row-span-2 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-transparent p-6 sm:p-8 flex flex-col justify-between min-h-[280px] group hover:border-zinc-300 dark:hover:border-white/[0.12] transition-colors duration-300" style={{ background: undefined }}>
              <div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-transparent" style={{ backgroundImage: 'linear-gradient(135deg, rgba(134,59,255,0.1), rgba(56,189,248,0.08))' }}>
                  <GripVertical size={18} className="text-purple-500 dark:text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-[-0.03em]">
                  Drag & drop that actually feels good.
                </h3>
                <p className="text-[14px] leading-relaxed text-zinc-500 max-w-[360px]">
                  Built on dnd-kit for buttery-smooth reordering. Move cards between columns, reorder lists — pixel-perfect, accessible, zero jank.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                {['To Do', '→', 'In Progress', '→', 'Done'].map((t, i) => (
                  <span key={i} className={`text-[10px] ${i % 2 === 1 ? 'text-purple-500' : 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06] rounded px-2 py-1'}`}>{t}</span>
                ))}
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-transparent p-6 sm:p-8 group hover:border-zinc-300 dark:hover:border-white/[0.12] transition-colors duration-300 min-h-[160px]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-transparent" style={{ backgroundImage: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(52,211,153,0.08))' }}>
                <Zap size={18} className="text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-[-0.03em]">Real-time, for real.</h3>
              <p className="text-[14px] leading-relaxed text-zinc-500">WebSocket-powered live sync. When someone moves a card, everyone sees it instantly. No refresh button needed.</p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-transparent p-6 sm:p-8 group hover:border-zinc-300 dark:hover:border-white/[0.12] transition-colors duration-300 min-h-[160px]">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-transparent" style={{ backgroundImage: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(167,139,250,0.08))' }}>
                <Users2 size={18} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-[-0.03em]">Your whole team, one board.</h3>
              <p className="text-[14px] leading-relaxed text-zinc-500">Invite collaborators by email. Assign tasks, share boards, stay aligned — without switching between 5 different apps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section id="how-it-works" className="relative py-20 sm:py-28 px-5 sm:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" aria-hidden="true" />

        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-zinc-300 dark:to-zinc-700" />
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.12em] font-semibold">How it works</span>
            <span className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-zinc-300 dark:to-zinc-700" />
          </div>

          <h2 className="text-center mb-14 sm:mb-16 font-extrabold text-zinc-900 dark:text-white" style={{ fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Three steps. That's it.
          </h2>

          <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 relative">
            <div className="hidden sm:block absolute top-[22px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-purple-400/20 via-sky-400/20 to-emerald-400/20" aria-hidden="true" />

            {[
              { num: '01', title: 'Create a board', body: 'Sign up, name your project, and you\'re in. Takes about 30 seconds.', color: '#a78bfa' },
              { num: '02', title: 'Add your columns', body: 'Set up your workflow — To Do, In Progress, Done, or whatever fits your team.', color: '#38bdf8' },
              { num: '03', title: 'Invite & go', body: 'Share the board link. Your team can start moving cards immediately.', color: '#34d399' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="relative w-11 h-11 rounded-full flex items-center justify-center font-mono text-sm font-bold mb-4 border-2 bg-white dark:bg-[#0a0a0c] z-10" style={{ borderColor: step.color, color: step.color, boxShadow: `0 0 20px ${step.color}15` }}>
                  {step.num}
                </div>
                <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-1.5 tracking-[-0.02em]">{step.title}</h3>
                <p className="text-[13px] leading-relaxed text-zinc-500 max-w-[220px]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FINAL CTA ══════════════════════ */}
      <section className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40" style={{ background: 'radial-gradient(circle, rgba(134,59,255,0.12) 0%, transparent 65%)', filter: 'blur(80px)' }} aria-hidden="true" />

        <div className="relative z-10 text-center max-w-[480px] mx-auto">
          <h2 className="mb-4 font-extrabold text-zinc-900 dark:text-white" style={{ fontSize: 'clamp(28px, 5vw, 50px)', letterSpacing: '-0.045em', lineHeight: 1.05 }}>
            Ready to move faster?
          </h2>
          <p className="text-[15px] leading-6 text-zinc-500 mb-8">Your team's next favorite tool is one click away.</p>

          <Link
            to="/register"
            className="group inline-flex items-center gap-2.5 h-12 px-6 rounded-lg font-semibold text-[15px] text-white no-underline transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
          >
            Get started — it's free
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
            {['Free forever', 'No credit card', 'Instant setup'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[12px] text-zinc-400 dark:text-zinc-600">
                <CheckCircle2 size={12} className="text-zinc-300 dark:text-zinc-700" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer className="border-t border-zinc-200 dark:border-white/[0.06] px-5 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-[1080px] mx-auto">
          <Logo size={13} textSize="13px" />
          <p className="text-[11px] text-zinc-400 dark:text-zinc-700 text-center">© {new Date().getFullYear()} KanbanBoard</p>
          <nav className="flex items-center gap-5" aria-label="Footer links">
            {[{ label: 'Log in', to: '/login' }, { label: 'Sign up', to: '/register' }].map(({ label, to }) => (
              <Link key={to} to={to} className="text-[12px] text-zinc-400 dark:text-zinc-600 no-underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-200">{label}</Link>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
