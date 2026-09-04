import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useAsset } from "@/hooks/useAsset"

const kbdClass =
    "rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm"

export default function CommandPalette({ open, onOpenChange }) {
    const navigate = useNavigate()
    const { accessibleModules } = useAsset()
    const [query, setQuery] = useState("")
    const [activeIndex, setActiveIndex] = useState(0)
    const activeItemRef = useRef(null)

    const entries = useMemo(() => {
        const list = []
        accessibleModules.forEach((module) => {
            list.push({ id: module.id, label: module.label, path: module.path, icon: module.icon })
            module.children?.forEach((child) => {
                list.push({ id: child.id, label: child.label, path: child.path })
            })
        })
        return list
    }, [accessibleModules])

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()
        if (!needle) return entries
        return entries.filter((entry) => entry.label.toLowerCase().includes(needle))
    }, [entries, query])

    useEffect(() => {
        activeItemRef.current?.scrollIntoView({ block: "nearest" })
    }, [activeIndex])

    const handleOpenChange = (nextOpen) => {
        if (nextOpen) {
            setQuery("")
            setActiveIndex(0)
        }
        onOpenChange(nextOpen)
    }

    const goTo = (entry) => {
        onOpenChange(false)
        navigate(entry.path)
    }

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault()
            setActiveIndex((current) => (filtered.length ? (current + 1) % filtered.length : 0))
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActiveIndex((current) => (filtered.length ? (current - 1 + filtered.length) % filtered.length : 0))
        } else if (event.key === "Enter") {
            const entry = filtered[activeIndex]
            if (entry) {
                event.preventDefault()
                goTo(entry)
            }
        }
    }

    return (
        <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className="fixed inset-0 isolate z-50 bg-black/20 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
                />
                <DialogPrimitive.Content
                    onKeyDown={handleKeyDown}
                    className="fixed top-[15%] left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 gap-0 rounded-xl bg-popover p-2 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
                >
                    <DialogPrimitive.Title className="sr-only">Search navigation</DialogPrimitive.Title>
                    <DialogPrimitive.Description className="sr-only">
                        Filter pages and navigate using the keyboard.
                    </DialogPrimitive.Description>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search pages..."
                            className="h-11 rounded-lg border-0 bg-slate-100/50 pl-9 pr-3 text-sm focus-visible:bg-white"
                        />
                    </div>
                    <div className="mt-2 max-h-72 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-6 text-sm text-muted-foreground">
                                No results for "{query}"
                            </p>
                        ) : (
                            <div className="grid gap-0.5">
                                {filtered.map((entry, index) => {
                                    const Icon = entry.icon
                                    const isActive = index === activeIndex
                                    return (
                                        <button
                                            key={entry.id}
                                            ref={isActive ? activeItemRef : undefined}
                                            type="button"
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onClick={() => goTo(entry)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${isActive ? "bg-slate-900 text-white" : "text-slate-700"}`}
                                        >
                                            {Icon && <Icon className="size-4 shrink-0" />}
                                            <span className="font-medium">{entry.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-200 px-2 pt-2 text-[10px] font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <kbd className={kbdClass}>&uarr;</kbd>
                            <kbd className={kbdClass}>&darr;</kbd>
                            <span>Navigate</span>
                        </span>
                        <div className="flex flex-1 justify-end gap-4">
                            <span className="flex items-center gap-1.5">
                                <kbd className={kbdClass}>Enter</kbd>
                                <span>Open</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <kbd className={kbdClass}>Esc</kbd>
                                <span>Close</span>
                            </span>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
