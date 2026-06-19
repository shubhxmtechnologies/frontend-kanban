import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import useAuthStore from '../../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import Logo from '../shared/Logo';
import ThemeToggle from '../shared/ThemeToggle';

const avatarUrls = [
    "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_6.png",
    "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
    "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
    "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_10.png",
    "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png"
]
const RegisterForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', avatar: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { setCredentials } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: String(e.target.value) });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password || !formData.avatar) {
            return toast.error('Please fill in all fields and select an avatar');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return toast.error('Enter a valid email address');
        }

        if (formData.email.length > 20) {
            return toast.error('Email cannot be more than 20 characters long');
        }

        if (formData.email.length < 5) {
            return toast.error('Email must be at least 5 characters long');
        }

        if (formData.password.length < 8) {
            return toast.error('Password must be at least 8 characters');
        }

        if (formData.password.length > 15) {
            return toast.error('Password cannot be more than 15 characters long');
        }

        setLoading(true);
        try {
            const data = await registerUser(formData);
            setCredentials(data, data.token);
            toast.success('Account created! Welcome, ' + data.name + '!');
            navigate('/dashboard');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#0a0a0c] transition-colors duration-300">
            {/* ── Navbar ─────────────────────────────────────────── */}
            <header className="border-b border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0c] h-14 shrink-0">
                <div className="h-full flex items-center justify-between max-w-[1200px] mx-auto px-5 sm:px-7">
                    <Link to="/" className="no-underline" aria-label="KanbanBoard home">
                        <Logo size={20} textSize="15px" />
                    </Link>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white no-underline transition-colors duration-200 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                        >
                            <ArrowLeft size={14} aria-hidden="true" />
                            Back
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Form area ───────────────────────────────────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-[400px] bg-white dark:bg-[#141416] rounded-xl border border-zinc-200 dark:border-white/[0.08] shadow-xl dark:shadow-none p-7 sm:p-10">

                    {/* Eyebrow */}
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-3">Create account</p>

                    {/* Headline */}
                    <h1 className="text-[24px] font-bold tracking-[-0.03em] leading-8 text-zinc-900 dark:text-white mb-7">
                        Join KanbanBoard.
                    </h1>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-live="polite">
                        {/* Avatar Selection */}
                        <div className="flex flex-col gap-2 mb-1">
                            <label className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                                Choose an avatar
                            </label>
                            <div className="flex items-center gap-3">
                                {avatarUrls.map((url, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, avatar: url })}
                                        className={`relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-200 border-2 ${formData.avatar === url
                                            ? 'border-purple-500 scale-110 shadow-md ring-2 ring-purple-500/20'
                                            : 'border-transparent hover:scale-105 bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
                                            }`}
                                        aria-label={url ? `Select avatar ${i + 1}` : "No avatar"}
                                    >
                                        {url ? (
                                            <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full cursor-pointer object-cover" />
                                        ) : (
                                            <User size={20} className="text-zinc-500 dark:text-zinc-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="register-name" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                                Full name
                            </label>
                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="h-10 px-3 rounded-lg text-sm bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors duration-200"
                                placeholder="Your name"
                                autoComplete="name"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="register-email" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                                Email
                            </label>
                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="h-10 px-3 rounded-lg text-sm bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors duration-200"
                                placeholder="you@example.com"
                                autoComplete="email"
                                spellCheck={false}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="register-password" className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                                    Password
                                </label>
                                <span className="text-[12px] text-zinc-400 dark:text-zinc-600">8–15 chars</span>
                            </div>
                            <div className="relative">
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 pr-10 rounded-lg text-sm bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors duration-200"
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                        </button>

                        {/* Terms */}
                        <p className="text-[12px] text-zinc-400 dark:text-zinc-600 text-center mt-1">
                            By signing up, you agree to our Terms of Service.
                        </p>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6" aria-hidden="true">
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-white/[0.06]" />
                        <span className="text-[12px] text-zinc-400 dark:text-zinc-600">or</span>
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-white/[0.06]" />
                    </div>

                    {/* Login link */}
                    <p className="text-center text-[14px] text-zinc-500">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-purple-600 dark:text-purple-400 no-underline font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;