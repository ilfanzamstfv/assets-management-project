import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronDown } from "lucide-react"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { DataPill, SectionHeader } from "@/components/asset/AssetUI"
import { useAsset } from "@/hooks/useAsset"
import { formatCurrency } from "@/lib/assetUtils"

export default function StockPage() {
    const {
        categories,
        locations,
        filteredStockItems,
        stockSearch,
        stockFilters,
        setStockSearch,
        setStockFilters,
        getCategoryName,
        getLocationName,
        loading,
        errors,
    } = useAsset()

    const selectedCategoryName = stockFilters.categoryId === "all"
        ? "Semua kategori"
        : categories.find((category) => String(category.id) === String(stockFilters.categoryId))?.name || "Semua kategori"
    const selectedLocationName = stockFilters.locationId === "all"
        ? "Semua lokasi"
        : locations.find((location) => String(location.id) === String(stockFilters.locationId))?.name || "Semua lokasi"
    const selectedSortName = stockFilters.sort === "lowest" ? "Stok terendah" : "Stok tertinggi"

    return (
        <ModuleGuard moduleId="stock">
            <SectionHeader
                title="Check Stock"
            />

            {errors.stock && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">{errors.stock}</CardContent>
                </Card>
            )}

            <Card className="border-white/60 bg-white/85 shadow-sm">
                <CardHeader>
                    <CardTitle>Stock Overview</CardTitle>
                    <CardDescription>Monitoring Stock</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <Input value={stockSearch} onChange={(event) => setStockSearch(event.target.value)} placeholder="Cari item / SKU" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedCategoryName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setStockFilters((current) => ({ ...current, categoryId: "all" }))}>
                                    Semua kategori
                                </DropdownMenuItem>
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.id} onClick={() => setStockFilters((current) => ({ ...current, categoryId: category.id }))}>
                                        {category.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedLocationName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setStockFilters((current) => ({ ...current, locationId: "all" }))}>
                                    Semua lokasi
                                </DropdownMenuItem>
                                {locations.map((location) => (
                                    <DropdownMenuItem key={location.id} onClick={() => setStockFilters((current) => ({ ...current, locationId: location.id }))}>
                                        {location.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedSortName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setStockFilters((current) => ({ ...current, sort: "highest" }))}>
                                    Stok tertinggi
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStockFilters((current) => ({ ...current, sort: "lowest" }))}>
                                    Stok terendah
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead>Item code</TableHead>
                                    <TableHead>Item name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!filteredStockItems.length && !loading.stock ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                            Tidak ada data stock yang cocok.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStockItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-slate-900">{item.sku}</TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{getCategoryName(item.categoryId) || "-"}</TableCell>
                                            <TableCell>{getLocationName(item.locationId) || "-"}</TableCell>
                                            <TableCell><DataPill>{item.status}</DataPill></TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.lastPurchasePrice)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </ModuleGuard>
    )
}
