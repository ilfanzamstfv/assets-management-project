import { ClipboardList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { DataPill, SectionHeader } from "@/components/asset/AssetUI"
import { useAsset } from "@/hooks/useAsset"
import { formatCurrency, formatDate } from "@/lib/assetUtils"

export default function PurchasesPage() {
    const {
        items,
        suppliers,
        modulePermissions,
        purchaseForm,
        purchaseFilters,
        filteredPurchases,
        setPurchaseForm,
        setPurchaseFilters,
        getItemName,
        getSupplierName,
        handlePurchaseSubmit,
        handleDeletePurchase,
        loading,
        errors,
    } = useAsset()

    const canManagePurchases = modulePermissions.purchases?.create

    return (
        <ModuleGuard moduleId="purchases">
            <SectionHeader
                title="Purchase History"
            />

            {errors.purchases && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">{errors.purchases}</CardContent>
                </Card>
            )}

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Input Pembelian</CardTitle>
                        <CardDescription>Frontend-only form untuk menambah purchase history baru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {canManagePurchases ? (
                            <form className="space-y-3" onSubmit={handlePurchaseSubmit}>
                                <select
                                    value={purchaseForm.itemId}
                                    onChange={(event) => {
                                        const nextItem = items.find((item) => item.id === event.target.value)
                                        setPurchaseForm((current) => ({
                                            ...current,
                                            itemId: event.target.value,
                                            supplierId: nextItem?.supplierId || "",
                                        }))
                                    }}
                                    className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm"
                                >
                                    <option value="">Pilih item</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={purchaseForm.supplierId}
                                    onChange={(event) => setPurchaseForm((current) => ({ ...current, supplierId: event.target.value }))}
                                    className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm"
                                >
                                    <option value="">Pilih supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                    ))}
                                </select>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <Input type="number" min="1" value={purchaseForm.quantity} onChange={(event) => setPurchaseForm((current) => ({ ...current, quantity: event.target.value }))} placeholder="Jumlah beli" />
                                    <Input type="number" min="0" value={purchaseForm.unitPrice} onChange={(event) => setPurchaseForm((current) => ({ ...current, unitPrice: event.target.value }))} placeholder="Harga satuan" />
                                </div>
                                <Input type="date" value={purchaseForm.purchaseDate} onChange={(event) => setPurchaseForm((current) => ({ ...current, purchaseDate: event.target.value }))} />
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                    <p className="text-slate-500">Total Harga</p>
                                    <p className="mt-1 text-lg font-semibold text-slate-900">
                                        {formatCurrency(Number(purchaseForm.quantity || 0) * Number(purchaseForm.unitPrice || 0))}
                                    </p>
                                </div>
                                <textarea
                                    value={purchaseForm.note}
                                    onChange={(event) => setPurchaseForm((current) => ({ ...current, note: event.target.value }))}
                                    placeholder="Catatan pembelian"
                                    className="min-h-24 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                />
                                <Button type="submit" className="w-full" disabled={loading.savePurchase}>
                                    <ClipboardList className="size-4" />
                                    {loading.savePurchase ? "Menyimpan..." : "Simpan Purchase"}
                                </Button>
                            </form>
                        ) : (
                            <p className="text-sm text-slate-500">Role ini tidak memiliki akses input purchase baru.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Riwayat Pembelian</CardTitle>
                        <CardDescription>Filter berdasarkan item, supplier, atau tanggal pembelian.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-3">
                            <select value={purchaseFilters.itemId} onChange={(event) => setPurchaseFilters((current) => ({ ...current, itemId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                                <option value="all">Semua item</option>
                                {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                            <select value={purchaseFilters.supplierId} onChange={(event) => setPurchaseFilters((current) => ({ ...current, supplierId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                                <option value="all">Semua supplier</option>
                                {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
                            </select>
                            <Input type="date" value={purchaseFilters.date} onChange={(event) => setPurchaseFilters((current) => ({ ...current, date: event.target.value }))} />
                        </div>

                        <div className="space-y-3">
                            {!filteredPurchases.length && !loading.purchases && (
                                <p className="text-sm text-slate-500">Belum ada purchase history.</p>
                            )}
                            {filteredPurchases.map((purchase) => (
                                <div key={purchase.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900">{purchase.itemName || getItemName(purchase.itemId)}</p>
                                            <p className="text-sm text-slate-500">
                                                {purchase.supplierName || getSupplierName(purchase.supplierId)} / {formatDate(purchase.purchaseDate)} / Input by {purchase.enteredBy}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DataPill>{purchase.quantity} unit</DataPill>
                                            <DataPill>{formatCurrency(purchase.unitPrice)}</DataPill>
                                            {modulePermissions.purchases?.delete && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleDeletePurchase(purchase.id)}>
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    {purchase.note && <p className="mt-3 text-sm text-slate-600">{purchase.note}</p>}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ModuleGuard>
    )
}
