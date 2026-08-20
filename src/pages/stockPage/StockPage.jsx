import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
                    <CardDescription>View-only stock monitoring tanpa alert low stock otomatis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <Input value={stockSearch} onChange={(event) => setStockSearch(event.target.value)} placeholder="Cari item / SKU" />
                        <select value={stockFilters.categoryId} onChange={(event) => setStockFilters((current) => ({ ...current, categoryId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                            <option value="all">Semua kategori</option>
                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                        <select value={stockFilters.locationId} onChange={(event) => setStockFilters((current) => ({ ...current, locationId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                            <option value="all">Semua lokasi</option>
                            {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                        </select>
                        <select value={stockFilters.sort} onChange={(event) => setStockFilters((current) => ({ ...current, sort: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                            <option value="highest">Stok tertinggi</option>
                            <option value="lowest">Stok terendah</option>
                        </select>
                    </div>

                    <div className="grid gap-3">
                        {!filteredStockItems.length && !loading.stock && (
                            <p className="flex justify-center text-sm text-slate-500 py-5">Tidak ada data stock yang cocok.</p>
                        )}
                        {filteredStockItems.map((item) => (
                            <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{item.name}</p>
                                    <p className="text-sm text-slate-500">{item.sku} / {getCategoryName(item.categoryId)} / {getLocationName(item.locationId)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <DataPill>{item.status}</DataPill>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-slate-900">{item.stock} {item.unit}</p>
                                        <p className="text-xs text-slate-500">Harga {formatCurrency(item.lastPurchasePrice)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </ModuleGuard>
    )
}
