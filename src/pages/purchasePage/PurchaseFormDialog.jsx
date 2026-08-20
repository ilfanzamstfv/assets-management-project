import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate } from "@/lib/assetUtils"
import { Calendar as CalendarIcon, ChevronDown, ClipboardList } from "lucide-react"

function FormDropdown({ value, placeholder, options, onSelect }) {
    const selectedLabel = value
        ? options.find((option) => String(option.id) === String(value))?.name
        : ""
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                    {selectedLabel || <span className="text-slate-500">{placeholder}</span>}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                {options.map((option) => (
                    <DropdownMenuItem key={option.id} onClick={() => onSelect(option)}>
                        {option.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function PurchaseFormDialog({
    isDialogOpen,
    setIsDialogOpen,
    editingPurchaseId,
    purchaseForm,
    setPurchaseForm,
    items,
    suppliers,
    loading,
    onSubmit,
}) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingPurchaseId ? "Edit Purchase" : "Add Purchase"}</DialogTitle>
                    <DialogDescription>
                        {editingPurchaseId ? "Ubah data riwayat pembelian." : "Tambahkan riwayat pembelian baru."}
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-3" onSubmit={onSubmit}>
                    <FormDropdown
                        placeholder="Select item"
                        value={purchaseForm.itemId}
                        options={items}
                        onSelect={(item) =>
                            setPurchaseForm((current) => ({
                                ...current,
                                itemId: String(item.id),
                                supplierId: item.supplierId ? String(item.supplierId) : "",
                            }))
                        }
                    />
                    <FormDropdown
                        placeholder="Select supplier"
                        value={purchaseForm.supplierId}
                        options={suppliers}
                        onSelect={(supplier) => setPurchaseForm((current) => ({ ...current, supplierId: String(supplier.id) }))}
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                        <Input type="number" min="1" value={purchaseForm.quantity} onChange={(event) => setPurchaseForm((current) => ({ ...current, quantity: event.target.value }))} placeholder="Quantity" />
                        <Input type="number" min="0" value={purchaseForm.unitPrice} onChange={(event) => setPurchaseForm((current) => ({ ...current, unitPrice: event.target.value }))} placeholder="Unit Price" />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-8 w-full justify-start gap-2 px-2.5 text-sm font-normal"
                            >
                                <CalendarIcon className="size-4 text-slate-500" />
                                {formatDate(purchaseForm.purchaseDate)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={purchaseForm.purchaseDate ? new Date(purchaseForm.purchaseDate) : undefined}
                                onSelect={(date) =>
                                    setPurchaseForm((current) => ({
                                        ...current,
                                        purchaseDate: date
                                            ? new Date(
                                                date.getTime() - date.getTimezoneOffset() * 60000
                                            ).toISOString().slice(0, 10)
                                            : current.purchaseDate,
                                    }))
                                }
                            />
                        </PopoverContent>
                    </Popover>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                        <p className="text-slate-500">Total Value</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                            {formatCurrency(Number(purchaseForm.quantity || 0) * Number(purchaseForm.unitPrice || 0))}
                        </p>
                    </div>
                    <textarea
                        value={purchaseForm.note}
                        onChange={(event) => setPurchaseForm((current) => ({ ...current, note: event.target.value }))}
                        placeholder="Note"
                        className="min-h-24 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading.savePurchase}>
                            {loading.savePurchase ? "Saving..." : editingPurchaseId ? "Save Change" : "Save Purchase"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}