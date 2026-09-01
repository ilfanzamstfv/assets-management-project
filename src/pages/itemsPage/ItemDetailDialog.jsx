import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataPill } from "@/components/asset/AssetUI"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/assetUtils"

function StatBox({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-900">{value}</p>
        </div>
    )
}

export default function ItemDetailDialog({
    item,
    onOpenChange,
    getCategoryName,
    getLocationName,
    getSupplierName,
    handleExportItem,
    canExport,
}) {
    return (
        <Dialog open={Boolean(item)} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Detail Item</DialogTitle>
                    <DialogDescription>Informasi lengkap item terpilih.</DialogDescription>
                </DialogHeader>
                {item && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <DataPill>{item.sku}</DataPill>
                            <DataPill>{getCategoryName(item.categoryId)}</DataPill>
                            <DataPill>{item.status}</DataPill>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-600">{item.description || "Belum ada deskripsi item."}</p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            <StatBox label="Lokasi" value={getLocationName(item.locationId)} />
                            <StatBox label="Supplier" value={getSupplierName(item.supplierId)} />
                            <StatBox label="Stok" value={`${item.stock} ${item.unit}`} />
                            <StatBox label="Harga Terakhir" value={formatCurrency(item.lastPurchasePrice || 0)} />
                        </div>
                        {item.purchaseHistories?.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-900">Riwayat Pembelian</p>
                                {item.purchaseHistories.slice(0, 5).map((purchase) => (
                                    <div key={purchase.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                        {purchase.supplierName || getSupplierName(purchase.supplierId)} / {purchase.quantity} unit / {formatCurrency(purchase.unitPrice)} / {purchase.purchaseDate?.slice(0, 10)}
                                    </div>
                                ))}
                            </div>
                        )}
                        {canExport && (
                            <Button type="button" onClick={() => handleExportItem(item)}>
                                <Download className="size-4" />
                                Export PDF
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
