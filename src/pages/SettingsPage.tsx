import { useState, useEffect } from "react"
import { Save, User, X } from "lucide-react"
import useAuthStore from "../store/useAuthStore"
import { updateMe } from "../api/authApi"
import toast from "react-hot-toast"

const avatarUrls = [
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_6.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_10.png",
  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png"
]

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name || "")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [loading, setLoading] = useState(false)

  // Sync state if user changes in store
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setAvatar(user.avatar || "")
    }
  }, [user])

  const hasChanges = user && (name.trim() !== user.name || avatar !== user.avatar)

  const handleCancel = () => {
    if (user) {
      setName(user.name || "")
      setAvatar(user.avatar || "")
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasChanges) return

    setLoading(true)
    try {
      const response = await updateMe({ name, avatar })
      if (response.updatedUser) {
        setUser(response.updatedUser)
        toast.success(response.message || "Profile updated successfully!")
      } else {
        toast.success("Profile updated successfully!")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "px-3 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.04] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors"

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-4xl mx-auto flex flex-col gap-8 w-full">
      {/* Header */}
      <div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.12em] font-semibold mb-1.5">Settings</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Workspace Settings.
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-white/[0.08] pb-2">
              Profile Details
            </h2>

            {/* Avatar Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Choose an avatar
              </label>
              <div className="flex items-center gap-3">
                {avatarUrls.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${avatar === url
                      ? 'scale-110 shadow-md ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-[#141416]'
                      : 'hover:scale-105 bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08]'
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

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prof-name" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`h-10 w-full ${inputClasses}`}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="prof-email" className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Email
              </label>
              <input
                id="prof-email"
                type="email"
                value={user.email}
                readOnly
                className={`h-10 w-full cursor-not-allowed ${inputClasses}`}
                required
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={!hasChanges || loading}
                className="flex items-center gap-1.5 h-10 px-5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
              >
                <Save className="size-4" />
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={!hasChanges || loading}
                className="flex items-center gap-1.5 h-10 px-5 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-200 dark:hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="size-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
