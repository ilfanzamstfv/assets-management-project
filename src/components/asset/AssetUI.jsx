import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SectionHeader({ title, description, action }) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {action}
        </div>
    )
}

export function StatCard({ title, value, note, icon: Icon }) {
    return (
        <Card className="border-white/60 bg-white/85 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardDescription>{title}</CardDescription>
                    <CardTitle className="mt-2 text-2xl">{value}</CardTitle>
                </div>
                <div className="rounded-lg bg-slate-900 p-2 text-white">
                    <Icon className="size-4" />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">{note}</p>
            </CardContent>
        </Card>
    )
}

export function DataPill({ children }) {
    return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
            {children}
        </span>
    )
}
