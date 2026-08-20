import { BadgeDollarSign, Boxes, MapPinned, PackagePlus } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { SectionHeader, StatCard } from "@/components/asset/AssetUI"
import { useAsset } from "@/hooks/useAsset"
import { formatCurrency, formatDate } from "@/lib/assetUtils"

export default function DashboardPage() {
    const { dashboardMetrics, locations, getItemName, getSupplierName, loading, errors } = useAsset()

    return (
        <ModuleGuard moduleId="dashboard">
            <SectionHeader
                title="Dashboard"
            />

            {errors.dashboard && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">{errors.dashboard}</CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Item" value={dashboardMetrics.totalItems} note="Jumlah master item yang tercatat." icon={Boxes} />
                <StatCard title="Total Stok" value={dashboardMetrics.totalStock} note="Akumulasi unit stok dari seluruh lokasi." icon={PackagePlus} />
                <StatCard title="Total Nilai Aset" value={formatCurrency(dashboardMetrics.totalAssetValue)} note="Menggunakan harga beli terakhir per item." icon={BadgeDollarSign} />
                <StatCard title="Lokasi Aktif" value={locations.length} note="Jumlah lokasi yang menjadi titik penyimpanan aset." icon={MapPinned} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Distribusi Item per Kategori</CardTitle>
                        <CardDescription>Snapshot jumlah item aktif di tiap kategori.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {loading.dashboard && <p className="text-sm text-slate-500">Loading dashboard...</p>}
                        {dashboardMetrics.categoryBreakdown.map((entry) => {
                            const percentage = dashboardMetrics.totalItems ? (entry.value / dashboardMetrics.totalItems) * 100 : 0
                            return (
                                <div key={entry.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-slate-700">{entry.label}</span>
                                        <span className="text-slate-500">{entry.value} item</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100">
                                        <div className="h-2 rounded-full bg-slate-900" style={{ width: `${Math.max(percentage, entry.value ? 8 : 0)}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Stok per Lokasi</CardTitle>
                        <CardDescription>Distribusi unit stok yang tersedia saat ini.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {loading.dashboard && <p className="text-sm text-slate-500">Loading location summary...</p>}
                        {dashboardMetrics.locationBreakdown.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                                <div>
                                    <p className="font-medium text-slate-800">{entry.label}</p>
                                    <p className="text-xs text-slate-500">Total unit tersedia</p>
                                </div>
                                <div className="text-lg font-semibold text-slate-900">{entry.value}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/60 bg-white/85 shadow-sm">
                <CardHeader>
                    <CardTitle>Purchase Terbaru</CardTitle>
                    <CardDescription>Beberapa transaksi terakhir yang memengaruhi stok masuk.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-slate-500">
                            <tr>
                                <th className="pb-3 font-medium">Tanggal</th>
                                <th className="pb-3 font-medium">Item</th>
                                <th className="pb-3 font-medium">Supplier</th>
                                <th className="pb-3 font-medium">Qty</th>
                                <th className="pb-3 font-medium">Harga Satuan</th>
                                <th className="pb-3 font-medium">Input By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!dashboardMetrics.latestPurchases.length && !loading.dashboard && (
                                <tr>
                                    <td className="py-3 text-slate-500" colSpan={6}>Belum ada transaksi terbaru.</td>
                                </tr>
                            )}
                            {dashboardMetrics.latestPurchases.map((purchase) => (
                                <tr key={purchase.id} className="border-t border-slate-100">
                                    <td className="py-3">{formatDate(purchase.purchaseDate)}</td>
                                    <td className="py-3 font-medium">{purchase.itemName || getItemName(purchase.itemId)}</td>
                                    <td className="py-3">{purchase.supplierName || getSupplierName(purchase.supplierId)}</td>
                                    <td className="py-3">{purchase.quantity}</td>
                                    <td className="py-3">{formatCurrency(purchase.unitPrice)}</td>
                                    <td className="py-3">{purchase.enteredBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </ModuleGuard>
    )
}
