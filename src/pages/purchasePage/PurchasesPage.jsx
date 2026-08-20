import { useState } from "react"
import { ChevronDown, Calendar as CalendarIcon, Eye, Pencil, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { DataPill, SectionHeader } from "@/components/asset/AssetUI"
import { useAsset } from "@/hooks/useAsset"
import { formatCurrency, formatDate } from "@/lib/assetUtils"
import PurchaseFormDialog from "./PurchaseFormDialog"
import PurchaseDetailDialog from "./PurchaseDetailDialog"

export default function PurchasesPage() {
    const {
        items,
        suppliers,
        modulePermissions,
        editingPurchaseId,
        purchaseForm,
        purchaseFilters,
        filteredPurchases,
        setPurchaseForm,
        setPurchaseFilters,
        getItemName,
        getSupplierName,
        resetPurchaseForm,
        handlePurchaseSubmit,
        handleEditPurchase,
        handleDeletePurchase,
        loading,
        errors,
    } = useAsset()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState(null)
    const [purchaseToDelete, setPurchaseToDelete] = useState(null)

    const canAddPurchase = modulePermissions.purchases?.create

    const selectedItemFilterName =
        purchaseFilters.itemId === "all"
            ? "All item"
            : items.find((item) => String(item.id) === String(purchaseFilters.itemId))?.name || "Pilih item"

    const selectedSupplierFilterName =
        purchaseFilters.supplierId === "all"
            ? "All supplier"
            : suppliers.find((supplier) => String(supplier.id) === String(purchaseFilters.supplierId))?.name || "Pilih supplier"

    const onAddClick = () => {
        resetPurchaseForm()
        setIsFormOpen(true)
    }

    const onEditClick = (purchase) => {
        handleEditPurchase(purchase)
        setIsFormOpen(true)
    }

    const onSubmit = async (event) => {
        await handlePurchaseSubmit(event)
        setIsFormOpen(false)
    }

    const onDeleteConfirm = async () => {
        if (!purchaseToDelete) return
        await handleDeletePurchase(purchaseToDelete)
        setPurchaseToDelete(null)
    }

    return (
        <ModuleGuard moduleId="purchases">
            <SectionHeader
                title="Purchase History"
                action={
                    canAddPurchase && (
                        <Button onClick={onAddClick} className="gap-2">
                            <Plus className="size-4" />
                            Add Purchase
                        </Button>
                    )
                }
            />

            {errors.purchases && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">{errors.purchases}</CardContent>
                </Card>
            )}

            <div className="grid gap-6">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>List Purchase History</CardTitle>
                        <CardDescription>Show purchase history by filtering item, supplier, or date.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                        {selectedItemFilterName}
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                    <DropdownMenuItem onClick={() => setPurchaseFilters((current) => ({ ...current, itemId: "all" }))}>
                                        All item
                                    </DropdownMenuItem>
                                    {items.map((item) => (
                                        <DropdownMenuItem key={item.id} onClick={() => setPurchaseFilters((current) => ({ ...current, itemId: String(item.id) }))}>
                                            {item.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                        {selectedSupplierFilterName}
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                    <DropdownMenuItem onClick={() => setPurchaseFilters((current) => ({ ...current, supplierId: "all" }))}>
                                        All supplier
                                    </DropdownMenuItem>
                                    {suppliers.map((supplier) => (
                                        <DropdownMenuItem key={supplier.id} onClick={() => setPurchaseFilters((current) => ({ ...current, supplierId: String(supplier.id) }))}>
                                            {supplier.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-8 w-full justify-start gap-2 px-2.5 text-sm font-normal"
                                    >
                                        <CalendarIcon className="size-4 text-slate-500" />
                                        {purchaseFilters.date ? (
                                            formatDate(purchaseFilters.date)
                                        ) : (
                                            <span className="text-slate-500">Select date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={purchaseFilters.date ? new Date(purchaseFilters.date) : undefined}
                                        onSelect={(date) =>
                                            setPurchaseFilters((current) => ({
                                                ...current,
                                                date: date
                                                    ? new Date(
                                                        date.getTime() - date.getTimezoneOffset() * 60000
                                                    ).toISOString().slice(0, 10)
                                                    : "",
                                            }))
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="w-16 text-center">No</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="w-24 text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPurchases.length > 0 ? (
                                        filteredPurchases.map((purchase, index) => (
                                            <TableRow key={purchase.id}>
                                                <TableCell className="text-center text-slate-500">{index + 1}</TableCell>
                                                <TableCell className="font-medium text-slate-900">
                                                    <p>{purchase.itemName || getItemName(purchase.itemId)}</p>
                                                    <p className="text-sm font-normal text-slate-500">Input by {purchase.enteredBy}</p>
                                                </TableCell>
                                                <TableCell>{purchase.supplierName || getSupplierName(purchase.supplierId)}</TableCell>
                                                <TableCell>{formatDate(purchase.purchaseDate)}</TableCell>
                                                <TableCell><DataPill>{purchase.quantity} unit</DataPill></TableCell>
                                                <TableCell>{formatCurrency(Number(purchase.quantity || 0) * Number(purchase.unitPrice || 0))}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-500 hover:text-blue-600"
                                                            onClick={() => setSelectedPurchase(purchase)}
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                        {modulePermissions.purchases?.update && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-500 hover:text-blue-600"
                                                                onClick={() => onEditClick(purchase)}
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        )}
                                                        {modulePermissions.purchases?.delete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-500 hover:text-red-600"
                                                                onClick={() => setPurchaseToDelete(purchase.id)}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                                {loading.purchases ? "Memuat..." : "No purchase history yet."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <PurchaseFormDialog
                isDialogOpen={isFormOpen}
                setIsDialogOpen={setIsFormOpen}
                editingPurchaseId={editingPurchaseId}
                purchaseForm={purchaseForm}
                setPurchaseForm={setPurchaseForm}
                items={items}
                suppliers={suppliers}
                loading={loading}
                onSubmit={onSubmit}
            />

            <PurchaseDetailDialog
                purchase={selectedPurchase}
                onOpenChange={(open) => { if (!open) setSelectedPurchase(null) }}
            />

            <AlertDialog open={Boolean(purchaseToDelete)} onOpenChange={(open) => !open && setPurchaseToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Purchase?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Riwayat pembelian ini akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="logout" className="bg-red-600 hover:bg-red-700 text-white" onClick={onDeleteConfirm}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ModuleGuard>
    )
}