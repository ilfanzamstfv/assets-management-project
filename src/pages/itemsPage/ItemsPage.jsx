import { Archive, Check, Download } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { DataPill, SectionHeader } from "@/components/asset/AssetUI"
import { useAsset } from "@/hooks/useAsset"
import { formatCurrency } from "@/lib/assetUtils"

export default function ItemsPage() {
    const navigate = useNavigate()
    const {
        categories,
        locations,
        suppliers,
        selectedItem,
        modulePermissions,
        editingItemId,
        itemForm,
        itemSearch,
        itemFilters,
        visibleItemPage,
        totalItemPages,
        paginatedItems,
        filteredItems,
        masterForm,
        setSelectedItemId,
        setItemForm,
        setItemSearch,
        setItemFilters,
        setItemPage,
        setMasterForm,
        getCategoryName,
        getLocationName,
        getSupplierName,
        resetItemForm,
        handleItemSubmit,
        handleEditItem,
        handleArchiveItem,
        handleAddMasterData,
        handleRemoveMasterData,
        handleExportItem,
        loading,
        errors,
    } = useAsset()

    const canManageItems = modulePermissions.items?.create || modulePermissions.items?.update

    return (
        <ModuleGuard moduleId="items">
            <SectionHeader
                title="Item Management"
                action={
                    <div className="flex gap-2">
                        {selectedItem && modulePermissions.items?.export && (
                            <Button type="button" onClick={() => handleExportItem(selectedItem)}>
                                <Download className="size-4" />
                                Export PDF
                            </Button>
                        )}
                        {editingItemId && (
                            <Button type="button" variant="outline" onClick={resetItemForm}>
                                Reset Form
                            </Button>
                        )}
                    </div>
                }
            />

            {(errors.items || errors.masterData || errors.itemDetail) && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">
                        {errors.items || errors.masterData || errors.itemDetail}
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Daftar Item</CardTitle>
                        <CardDescription>Pencarian, filter, pagination, dan aksi cepat item.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                            <div className="xl:col-span-2">
                                <Input
                                    value={itemSearch}
                                    onChange={(event) => {
                                        setItemSearch(event.target.value)
                                        setItemPage(1)
                                    }}
                                    placeholder="Cari nama item atau SKU"
                                />
                            </div>
                            <select
                                value={itemFilters.categoryId}
                                onChange={(event) => {
                                    setItemFilters((current) => ({ ...current, categoryId: event.target.value }))
                                    setItemPage(1)
                                }}
                                className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm"
                            >
                                <option value="all">Semua kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            <select
                                value={itemFilters.locationId}
                                onChange={(event) => {
                                    setItemFilters((current) => ({ ...current, locationId: event.target.value }))
                                    setItemPage(1)
                                }}
                                className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm"
                            >
                                <option value="all">Semua lokasi</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>{location.name}</option>
                                ))}
                            </select>
                            <select
                                value={itemFilters.status}
                                onChange={(event) => {
                                    setItemFilters((current) => ({ ...current, status: event.target.value }))
                                    setItemPage(1)
                                }}
                                className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm"
                            >
                                <option value="all">Semua status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <table className="min-w-full text-sm">
                                <thead className="bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Item</th>
                                        <th className="px-4 py-3 font-medium">Kategori</th>
                                        <th className="px-4 py-3 font-medium">Lokasi</th>
                                        <th className="px-4 py-3 font-medium">Stok</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {!paginatedItems.length && !loading.items && (
                                        <tr>
                                            <td className="px-4 py-6 text-slate-500" colSpan={6}>Tidak ada item yang cocok dengan filter saat ini.</td>
                                        </tr>
                                    )}
                                    {paginatedItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={`${selectedItem?.id === item.id ? "bg-slate-50" : ""} border-t border-slate-100`}
                                        >
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    className="text-left"
                                                    onClick={() => setSelectedItemId(item.id)}
                                                >
                                                    <p className="font-medium text-slate-900">{item.name}</p>
                                                    <p className="text-xs text-slate-500">{item.sku}</p>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">{getCategoryName(item.categoryId)}</td>
                                            <td className="px-4 py-3">{getLocationName(item.locationId)}</td>
                                            <td className="px-4 py-3">{item.stock} {item.unit}</td>
                                            <td className="px-4 py-3">
                                                <DataPill>{item.status}</DataPill>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {modulePermissions.items?.update && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                handleEditItem(item)
                                                                navigate("/home/items")
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                    {modulePermissions.items?.delete && (
                                                        <Button type="button" size="sm" variant="outline" onClick={() => handleArchiveItem(item.id)}>
                                                            <Archive className="size-3.5" />
                                                            {item.status === "ACTIVE" ? "Archive" : "Activate"}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Menampilkan {paginatedItems.length} dari {filteredItems.length} item
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={visibleItemPage === 1}
                                    onClick={() => setItemPage((current) => Math.max(1, current - 1))}
                                >
                                    Prev
                                </Button>
                                <span className="text-sm text-slate-600">
                                    {visibleItemPage} / {totalItemPages}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={visibleItemPage === totalItemPages}
                                    onClick={() => setItemPage((current) => Math.min(totalItemPages, current + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-white/60 bg-white/85 shadow-sm">
                        <CardHeader>
                            <CardTitle>{editingItemId ? "Edit Item" : "Tambah Item"}</CardTitle>
                            <CardDescription>Form frontend untuk create dan update data master item.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {canManageItems ? (
                                <form className="space-y-3" onSubmit={handleItemSubmit}>
                                    <Input value={itemForm.name} onChange={(event) => setItemForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama item" />
                                    <Input value={itemForm.sku} onChange={(event) => setItemForm((current) => ({ ...current, sku: event.target.value }))} placeholder="Kode / SKU item" />
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <select value={itemForm.categoryId} onChange={(event) => setItemForm((current) => ({ ...current, categoryId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                                            <option value="">Pilih kategori</option>
                                            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                                        </select>
                                        <select value={itemForm.locationId} onChange={(event) => setItemForm((current) => ({ ...current, locationId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                                            <option value="">Pilih lokasi</option>
                                            {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <select value={itemForm.supplierId} onChange={(event) => setItemForm((current) => ({ ...current, supplierId: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                                            <option value="">Pilih supplier</option>
                                            {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
                                        </select>
                                        <select value={itemForm.status} onChange={(event) => setItemForm((current) => ({ ...current, status: event.target.value }))} className="h-8 rounded-lg border border-input bg-white px-2.5 text-sm">
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <Input type="number" min="0" value={itemForm.stock} onChange={(event) => setItemForm((current) => ({ ...current, stock: event.target.value }))} placeholder="Jumlah stok" />
                                        <Input value={itemForm.unit} onChange={(event) => setItemForm((current) => ({ ...current, unit: event.target.value }))} placeholder="Satuan" />
                                        <Input type="number" min="0" value={itemForm.lastPurchasePrice} onChange={(event) => setItemForm((current) => ({ ...current, lastPurchasePrice: event.target.value }))} placeholder="Harga beli terakhir" />
                                    </div>
                                    <textarea
                                        value={itemForm.description}
                                        onChange={(event) => setItemForm((current) => ({ ...current, description: event.target.value }))}
                                        placeholder="Deskripsi item"
                                        className="min-h-24 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                                    />
                                    <Button type="submit" className="w-full" disabled={loading.saveItem}>
                                        <Check className="size-4" />
                                        {loading.saveItem ? "Menyimpan..." : editingItemId ? "Simpan Perubahan" : "Tambah Item"}
                                    </Button>
                                </form>
                            ) : (
                                <p className="text-sm text-slate-500">Role ini hanya bisa melihat data item.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-white/60 bg-white/85 shadow-sm">
                        <CardHeader>
                            <CardTitle>Detail Item</CardTitle>
                            <CardDescription>Panel detail item terpilih sekaligus titik export PDF.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedItem ? (
                                <>
                                    <div className="flex flex-wrap gap-2">
                                        <DataPill>{selectedItem.sku}</DataPill>
                                        <DataPill>{getCategoryName(selectedItem.categoryId)}</DataPill>
                                        <DataPill>{selectedItem.status}</DataPill>
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">{selectedItem.name}</p>
                                        <p className="text-sm text-slate-600">{selectedItem.description || "Belum ada deskripsi item."}</p>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Lokasi</p>
                                            <p className="mt-1 font-medium">{getLocationName(selectedItem.locationId)}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Supplier</p>
                                            <p className="mt-1 font-medium">{getSupplierName(selectedItem.supplierId)}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Stok</p>
                                            <p className="mt-1 font-medium">{selectedItem.stock} {selectedItem.unit}</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Harga Terakhir</p>
                                            <p className="mt-1 font-medium">{formatCurrency(selectedItem.lastPurchasePrice || 0)}</p>
                                        </div>
                                    </div>
                                    {selectedItem.purchaseHistories?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-slate-900">Riwayat Pembelian</p>
                                            {selectedItem.purchaseHistories.slice(0, 5).map((purchase) => (
                                                <div key={purchase.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                                    {purchase.supplierName || getSupplierName(purchase.supplierId)} / {purchase.quantity} unit / {formatCurrency(purchase.unitPrice)} / {purchase.purchaseDate?.slice(0, 10)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-500">Pilih item dari daftar untuk melihat detailnya.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>


        </ModuleGuard>
    )
}
