import { useMemo } from "react"
import { Link } from "react-router-dom"
import { BadgeDollarSign, Boxes, MapPinned, PackagePlus } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { SectionHeader, StatCard } from "@/components/asset/AssetUI"
import { useDashboardData } from "@/hooks/useDashboardData"
import { useAsset } from "@/hooks/useAsset"
import { formatCompactCurrency, formatCurrency, formatDate } from "@/lib/assetUtils"

const trendChartConfig = {
    value: { label: "Purchase value", color: "var(--color-chart-1)" },
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="flex flex-col items-start gap-3 py-2 text-sm">
            <p className="text-destructive">{message}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>
        </div>
    )
}

function EmptyState({ children }) {
    return <p className="py-8 text-sm text-muted-foreground">{children}</p>
}

export default function DashboardPage() {
    const { dashboardMetrics, locations, getItemName, getSupplierName, loading, errors } = useAsset()
    const { trend, trendWindow, lowestStock, loading: dataLoading, errors: dataErrors, retry } = useDashboardData()

    const categoryData = dashboardMetrics.categoryBreakdown
    const categoryTotal = useMemo(
        () => categoryData.reduce((sum, entry) => sum + Number(entry.value || 0), 0),
        [categoryData]
    )
    const hasTrendData = trend.some((entry) => entry.value > 0)

    return (
        <ModuleGuard moduleId="dashboard">
            <SectionHeader
                title="Dashboard"
                description="Asset overview, purchase flow, and stock that needs attention."
            />

            {errors.dashboard && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">{errors.dashboard}</CardContent>
                </Card>
            )}

            {loading.dashboard ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[0, 1, 2, 3].map((index) => (
                        <Card key={index} className="border-white/60 bg-white/85 shadow-sm">
                            <CardContent className="space-y-2 pt-2">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-7 w-32" />
                                <Skeleton className="h-3 w-40" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Items" value={dashboardMetrics.totalItems} note="Number of recorded master items." icon={Boxes} />
                    <StatCard title="Total Stock" value={dashboardMetrics.totalStock} note="Accumulated stock units across all locations." icon={PackagePlus} />
                    <StatCard title="Total Asset Value" value={formatCurrency(dashboardMetrics.totalAssetValue)} note="Based on the latest purchase price per item." icon={BadgeDollarSign} />
                    <StatCard title="Active Locations" value={locations.length} note="Number of locations used as asset storage points." icon={MapPinned} />
                </div>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Purchase value per day, last {trendWindow} days</CardTitle>
                        <CardDescription>Total recorded purchase transaction value per day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dataLoading.trend && <Skeleton className="h-[280px] w-full" />}
                        {!dataLoading.trend && dataErrors.trend && (
                            <ErrorState message={dataErrors.trend} onRetry={retry} />
                        )}
                        {!dataLoading.trend && !dataErrors.trend && (
                            hasTrendData ? (
                                <ChartContainer config={trendChartConfig} className="aspect-auto h-[280px] w-full">
                                    <BarChart data={trend}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            minTickGap={24}
                                        />
                                        <YAxis
                                            tickFormatter={formatCompactCurrency}
                                            tickLine={false}
                                            axisLine={false}
                                            width={64}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            ) : (
                                <EmptyState>
                                    No purchases in the last {trendWindow} days. Record a new purchase in Purchase History to see the trend.
                                </EmptyState>
                            )
                        )}
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Item distribution by category</CardTitle>
                        <CardDescription>Share of active items in each category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading.dashboard && (
                            <Skeleton className="mx-auto aspect-square w-full max-w-[250px] rounded-full" />
                        )}
                        {!loading.dashboard && categoryData.length === 0 && (
                            <EmptyState>
                                No categories recorded yet. Add a category first in Master Data.
                            </EmptyState>
                        )}
                        {!loading.dashboard && categoryData.length > 0 && (
                            <div className="relative">
                                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="label"
                                            innerRadius={56}
                                            paddingAngle={4}
                                            strokeWidth={0}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell
                                                    key={entry.id ?? entry.label}
                                                    fill={`var(--color-chart-${(index % 5) + 1})`}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-semibold text-foreground">{categoryTotal}</span>
                                    <span className="text-xs text-muted-foreground">items</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Lowest stock</CardTitle>
                        <CardDescription>Items with the lowest stock to inform reorder decisions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dataLoading.lowestStock && (
                            <div className="space-y-2">
                                {[0, 1, 2, 3].map((index) => (
                                    <Skeleton key={index} className="h-10 w-full" />
                                ))}
                            </div>
                        )}
                        {!dataLoading.lowestStock && dataErrors.lowestStock && (
                            <ErrorState message={dataErrors.lowestStock} onRetry={retry} />
                        )}
                        {!dataLoading.lowestStock && !dataErrors.lowestStock && (
                            lowestStock.length === 0 ? (
                                <EmptyState>
                                    No items registered yet. Add items in Item Management.
                                </EmptyState>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead className="text-right">Stock</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lowestStock.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Link
                                                        to="/home/stock"
                                                        className="font-medium hover:underline focus-visible:underline"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground">{item.sku}</p>
                                                </TableCell>
                                                <TableCell>{item.location?.name || "-"}</TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">{item.stock}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )
                        )}
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent purchases</CardTitle>
                        <CardDescription>The latest transactions that affected incoming stock.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading.dashboard && (
                            <div className="space-y-2">
                                {[0, 1, 2, 3].map((index) => (
                                    <Skeleton key={index} className="h-10 w-full" />
                                ))}
                            </div>
                        )}
                        {!loading.dashboard && (
                            dashboardMetrics.latestPurchases.length === 0 ? (
                                <EmptyState>
                                    No recent transactions yet. Record the first purchase in Purchase History.
                                </EmptyState>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Item</TableHead>
                                            <TableHead>Supplier</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead>Input By</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dashboardMetrics.latestPurchases.map((purchase) => (
                                            <TableRow key={purchase.id}>
                                                <TableCell className="whitespace-nowrap">{formatDate(purchase.purchaseDate)}</TableCell>
                                                <TableCell className="font-medium">{purchase.itemName || getItemName(purchase.itemId)}</TableCell>
                                                <TableCell>{purchase.supplierName || getSupplierName(purchase.supplierId)}</TableCell>
                                                <TableCell className="text-right tabular-nums">{purchase.quantity}</TableCell>
                                                <TableCell className="text-right whitespace-nowrap">{formatCurrency(purchase.unitPrice)}</TableCell>
                                                <TableCell>{purchase.enteredBy}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </ModuleGuard>
    )
}
