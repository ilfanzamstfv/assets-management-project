import { useState, useEffect } from "react"
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { FingerprintPattern, LogOut, ChevronDown, Search } from "lucide-react"

import CommandPalette from "@/components/asset/CommandPalette"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/useAuth"
import { useAsset } from "@/hooks/useAsset"

export default function AssetLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const isDashboard = location.pathname === "/home"
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [commandOpen, setCommandOpen] = useState(false)
    const [openMenus, setOpenMenus] = useState(() => {
        const initial = {}
        if (location.pathname.includes("master-data")) {
            initial["master-data"] = true
        }
        return initial
    })

    const toggleMenu = (id) => {
        setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }))
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                setCommandOpen((open) => !open)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    const { logout, user } = useAuth()
    const { accessibleModules, currentRole, currentUserName } = useAsset()
    const avatarFallback = currentUserName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "AT"

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f7f7f4_0%,#eef3f8_55%,#ffffff_100%)] text-slate-900">
            <div className="mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
                <header className={`sticky top-4 z-50 rounded-2xl border border-white/70 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 ${isScrolled ? "p-1 px-5" : "p-4"}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center">
                            <div className={`overflow-hidden transition-all duration-300 ${isScrolled ? "w-0 opacity-0 mr-0" : "w-[3.25rem] opacity-100 mr-5"}`}>
                                <div className="rounded-xl bg-slate-900 p-3 text-white shadow-sm flex items-center justify-center">
                                    <FingerprintPattern className="size-7 shrink-0" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className={`font-semibold text-slate-950 font-sans-narrow transition-all duration-300 ${isScrolled ? "text-lg" : "text-2xl"}`}>Authora</h1>
                                <div className={`overflow-hidden transition-all duration-300 ${isScrolled ? "h-0 opacity-0" : "h-5 opacity-100 mt-0.5"}`}>
                                    <p className="text-sm text-slate-600 whitespace-nowrap">Assets Management System</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            {/* search bar */}
                            <div className="relative flex-1 max-w-md hidden md:block mx-4">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <Input
                                    type="search"
                                    readOnly
                                    aria-label="Open search"
                                    placeholder="Search"
                                    onClick={() => setCommandOpen(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            setCommandOpen(true)
                                        }
                                    }}
                                    className={`cursor-pointer transition-all duration-300 h-9 w-full rounded-full bg-slate-100/50 pl-9 pr-14 text-sm focus-visible:bg-white ${isScrolled ? "h-7 pl-7 pr-12 text-sm" : "h-9 pl-9 pr-14 text-sm"}`}
                                />
                                <div className={`transition-all duration-300 absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm ${isScrolled ? "px-1 py-0.5 text-xs" : "px-1.5 py-0.5"}`}>
                                    <span>Ctrl</span> <span>K</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                type="button"
                                                className="flex items-center gap-2 rounded-full p-1 pr-2 outline-none transition hover:bg-slate-100 focus-visible:ring-3 focus-visible:ring-slate-300"
                                                aria-label="Buka menu akun"
                                            >
                                                <Avatar className={`transition-all duration-300 ${isScrolled ? "size-7" : "size-9"}`}>
                                                    <AvatarImage src={user?.avatar} alt={currentUserName} />
                                                    <AvatarFallback className="bg-slate-900 text-xs text-white">
                                                        {avatarFallback}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <ChevronDown className={`text-slate-500 transition-all duration-300 ${isScrolled ? "size-3" : "size-4"}`} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64">
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-10">
                                                        <AvatarImage src={user?.avatar} alt={currentUserName} />
                                                        <AvatarFallback className="bg-slate-900 text-xs text-white">
                                                            {avatarFallback}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-slate-900">
                                                            {currentUserName}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500">Role: <span className="font-bold">{currentRole}</span></p>
                                                    </div>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-700"
                                                onSelect={() => setLogoutDialogOpen(true)}
                                            >
                                                <LogOut className="size-4" />
                                                <span>Logout</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Logout from this workspace?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Session will be closed and you will return to the login page.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction variant="logout" onClick={handleLogout}>Logout</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <aside className="sticky top-32 z-40 self-start rounded-2xl border border-white/70 bg-white/75 p-3 shadow-sm backdrop-blur-md">
                        <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Menus
                        </div>
                        <div className="grid gap-2">
                            {accessibleModules.map((module) => {
                                const Icon = module.icon

                                if (module.children) {
                                    const isOpen = openMenus[module.id]
                                    const isActiveRoute = module.children.some(c => location.pathname.includes(c.path))
                                    return (
                                        <div key={module.id} className="grid gap-1">
                                            <button
                                                type="button"
                                                onClick={() => toggleMenu(module.id)}
                                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${isActiveRoute ? "text-slate-900 bg-slate-100/50" : "text-slate-700 bg-white hover:bg-slate-100"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className="size-4" />
                                                    <span className="text-sm font-medium">{module.label}</span>
                                                </div>
                                                <ChevronDown className={`size-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            <div className={`ml-5 grid gap-1 border-l-2 border-slate-100 pl-2 transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
                                                }`}>
                                                {module.children.map((child) => (
                                                    <NavLink
                                                        key={child.id}
                                                        to={child.path}
                                                        className={({ isActive }) =>
                                                            `flex items-center gap-2 rounded-lg px-3 py-2 text-left transition ${isActive
                                                                ? "bg-slate-900 text-white shadow-sm"
                                                                : "bg-white text-slate-600 hover:bg-slate-100"
                                                            }`
                                                        }
                                                    >
                                                        <span className="text-xs font-medium">{child.label}</span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <NavLink
                                        key={module.id}
                                        to={module.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${isActive
                                                ? "bg-slate-900 text-white shadow-sm"
                                                : "bg-white text-slate-700 hover:bg-slate-100"
                                            }`
                                        }
                                    >
                                        <Icon className="size-4" />
                                        <span className="text-sm font-medium">{module.label}</span>
                                    </NavLink>
                                )
                            })}
                        </div>
                    </aside>

                    <main className="space-y-6">
                        {/* Welcome Banner - Only show on Dashboard */}
                        {isDashboard && (
                            <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/50 p-6 shadow-sm backdrop-blur-md">
                                {/* Decorative Background Icon */}
                                <div className="absolute -right-6 -top-6 text-slate-100 opacity-50">
                                    <FingerprintPattern className="size-40" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-2xl bg-slate-900 p-3 text-white shadow-md">
                                            <FingerprintPattern className="size-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">
                                                Welcome to Authora, <span className="text-slate-700">{currentUserName}</span>!
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-600">
                                                What would you like to do today?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {accessibleModules.map((module) => {
                                            const Icon = module.icon
                                            return (
                                                <NavLink
                                                    key={`shortcut-${module.id}`}
                                                    to={module.path}
                                                    className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-900 hover:text-white hover:ring-slate-900 hover:shadow-md"
                                                >
                                                    <Icon className="size-4 transition-transform group-hover:scale-110" />
                                                    {module.label}
                                                </NavLink>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        <Outlet />
                    </main>
                </div>
            </div>
            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </div>
    )
}
