import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  LayoutGrid,
  Users,
  Activity,
  ArrowRight,
  Plus,
  ClipboardList
} from "lucide-react"
import useBoardStore from "../store/useBoardStore"
import useAuthStore from "../store/useAuthStore"
import { getBoards } from "../api/boardApi"
import toast from "react-hot-toast"
import type { IBoard } from "../types"
import { formatDate } from "../helpers/dateFormat"

export default function DashboardOverviewPage() {
  const { boards, setBoards } = useBoardStore()
  const { user } = useAuthStore()

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoards()
        setBoards(data)
      } catch {
        toast.error("Failed to load boards")
      } finally {
        setLoading(false)
      }
    }
    fetchBoards()
  }, [setBoards])

  const countTeamMembers = (cBoards: IBoard[]) => {
    const uniqueMembers = new Set<string>();

    cBoards.forEach((board: IBoard) => {
      board.members.forEach((member) => {
        if (member._id !== board.owner._id) {
          uniqueMembers.add(member._id);
        }
      });
    });

    const totalUniqueMembers = uniqueMembers.size;
    return totalUniqueMembers
  }
  
  const countCollabBoards = (cBoards: IBoard[]) => {
    if (!user) return 0;
    let count = 0;
    cBoards.forEach((board: IBoard) => {
      if (board.owner._id !== user._id) {
        count++;
      }
    });
    return count;
  }
  const stats = [
    {
      title: "Workspace Boards",
      value: loading ? "..." : boards.length,
      description: "Active boards you collaborate on",
      icon: LayoutGrid,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-500/10",
    },
    {
      title: "Team Members",
      value: loading ? "..." : countTeamMembers(boards),
      description: "Contributors in your workspace",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-500/10",
    },
    {
      title: "Collab Boards",
      value: loading ? "..." : countCollabBoards(boards),
      description: "people who added you on boards",
      icon: Activity,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-500/10",
    },

  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl mx-auto flex flex-col gap-8 w-full">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="flex flex-col gap-3 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Overview.
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Keep track of your projects, collaborate with your team, and complete tasks in your interactive Kanban boards.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  {stat.title}
                </span>
                <div className={`size-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon className="size-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl  font-bold tracking-tight text-zinc-900 dark:text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Main Content Area: Boards list + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Boards list section */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">Recent Boards</h2>
            <Link
              to="/my-boards"
              className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
            >
              <span>View all boards</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-white/[0.04] p-5 h-32 animate-pulse"
                />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] border-dashed rounded-xl h-64">
              <ClipboardList className="size-10 text-zinc-400 dark:text-zinc-600 mb-3" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">No boards found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-xs">
                Create a board to start planning, organizing, and completing tasks.
              </p>
              <button
                onClick={() => navigate("/my-boards")}
                className="flex items-center justify-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold text-white transition-all duration-200 cursor-pointer hover:brightness-110 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #863bff 100%)' }}
              >
                <Plus className="size-3.5" />
                <span>Create first board</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {boards.slice(0, 6).map((board) => (
                <div
                  key={board._id}
                  onClick={() => navigate(`/board/${board._id}`)}
                  className="group relative bg-white dark:bg-[#141416] border border-zinc-200 dark:border-white/[0.08] rounded-xl p-5 flex flex-col justify-between h-32 hover:border-purple-500/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                      {board.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Created at {formatDate(board.createdAt)}.</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-white/[0.06] pt-3 mt-auto">
                    <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Open board</span>
                    <ArrowRight className="size-4 text-zinc-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </div>
  )
}
