import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export default function ItemFormDialog({
    isOpen,
    setIsOpen,
    editingItemId,
    itemForm,
    setItemForm,
    categories,
    locations,
    suppliers,
    loading,
    onSubmit,
}) {
    const selectedCategoryName = itemForm.categoryId
        ? categories.find((category) => String(category.id) === String(itemForm.categoryId))?.name || "Select Category"
        : "Select Category"
    const selectedLocationName = itemForm.locationId
        ? locations.find((location) => String(location.id) === String(itemForm.locationId))?.name || "Select Location"
        : "Select Location"
    const selectedSupplierName = itemForm.supplierId
        ? suppliers.find((supplier) => String(supplier.id) === String(itemForm.supplierId))?.name || "Select supplier"
        : "Select supplier"
    const selectedStatusName = itemForm.status === "INACTIVE" ? "Inactive" : "Active"

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>{editingItemId ? "Edit Item" : "Add Item"}</DialogTitle>
                    <DialogDescription>{editingItemId ? "Edit form below to update item." : "Enter form below to add new item."}.</DialogDescription>
                </DialogHeader>
                <form className="space-y-3 pt-2" onSubmit={onSubmit}>
                    <Input value={itemForm.name} onChange={(event) => setItemForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama item" />
                    <Input value={itemForm.sku} onChange={(event) => setItemForm((current) => ({ ...current, sku: event.target.value }))} placeholder="Kode / SKU item" />
                    <div className="grid gap-3 md:grid-cols-2">
                        {/* Category */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedCategoryName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setItemForm((current) => ({ ...current, categoryId: "" }))}>Select category</DropdownMenuItem>
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.id} onClick={() => setItemForm((current) => ({ ...current, categoryId: category.id }))}>
                                        {category.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Location */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedLocationName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setItemForm((current) => ({ ...current, locationId: "" }))}>Select location</DropdownMenuItem>
                                {locations.map((location) => (
                                    <DropdownMenuItem key={location.id} onClick={() => setItemForm((current) => ({ ...current, locationId: location.id }))}>
                                        {location.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">

                        {/* Supplier */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedSupplierName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setItemForm((current) => ({ ...current, supplierId: "" }))}>Select supplier</DropdownMenuItem>
                                {suppliers.map((supplier) => (
                                    <DropdownMenuItem key={supplier.id} onClick={() => setItemForm((current) => ({ ...current, supplierId: supplier.id }))}>
                                        {supplier.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Status */}
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedStatusName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => setItemForm((current) => ({ ...current, status: "ACTIVE" }))}>Active</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setItemForm((current) => ({ ...current, status: "INACTIVE" }))}>Inactive</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading.saveItem}>
                            {loading.saveItem ? "Saving..." : editingItemId ? "Save Change" : "Add Item"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
