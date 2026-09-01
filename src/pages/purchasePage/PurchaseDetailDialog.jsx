import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/assetUtils"

function StatBox({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-1 font-medium text-slate-900">{value}</p>
        </div>
    )
}

export default function PurchaseDetailDialog({ purchase, onOpenChange }) {
    return (
        <Dialog open={Boolean(purchase)} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detail Purchase</DialogTitle>
                    <DialogDescription>Complete purchase history details</DialogDescription>
                </DialogHeader>
                {purchase ? (
                    <div className="space-y-3">
                        <div>
                            <p className="font-medium text-slate-900">{purchase.itemName || "-"}</p>
                            <p className="text-sm text-slate-500">{purchase.supplierName || "-"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <StatBox label="Jumlah" value={`${purchase.quantity} unit`} />
                            <StatBox label="Harga Satuan" value={formatCurrency(purchase.unitPrice)} />
                            <StatBox label="Total Harga" value={formatCurrency(Number(purchase.quantity || 0) * Number(purchase.unitPrice || 0))} />
                            <StatBox label="Tanggal" value={formatDate(purchase.purchaseDate)} />
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Input oleh</p>
                            <p className="mt-1 font-medium text-slate-900">{purchase.enteredBy}</p>
                        </div>
                        {purchase.note && (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Catatan</p>
                                <p className="mt-1 text-sm text-slate-600">{purchase.note}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Tidak ada data purchase yang dipilih.</p>
                )}
            </DialogContent>
        </Dialog>
    )
}