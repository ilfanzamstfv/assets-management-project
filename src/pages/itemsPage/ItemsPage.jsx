import { CircleX, Eye, Plus, ChevronDown, Pencil, CircleCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
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
import ModuleGuard from "@/components/asset/ModuleGuard"
import { DataPill, SectionHeader } from "@/components/asset/AssetUI"
import { useAsset } from "@/hooks/useAsset"
import ItemDetailDialog from "./ItemDetailDialog"
import ItemFormDialog from "./ItemFormDialog"

export default function ItemsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
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
        setSelectedItemId,
        setItemSearch,
        setItemFilters,
        setItemPage,
        getCategoryName,
        getLocationName,
        getSupplierName,
        resetItemForm,
        handleItemSubmit,
        handleEditItem,
        handleArchiveItem,
        handleExportItem,
        loading,
        errors,
        setItemForm,
    } = useAsset()

    const canManageItems = modulePermissions.items?.create || modulePermissions.items?.update
    const selectedCategoryName = itemFilters.categoryId === "all"
        ? "All Category"
        : categories.find((category) => String(category.id) === String(itemFilters.categoryId))?.name || "All Category"
    const selectedLocationName = itemFilters.locationId === "all"
        ? "All Location"
        : locations.find((location) => String(location.id) === String(itemFilters.locationId))?.name || "All Location"
    const selectedStatusName = itemFilters.status === "ACTIVE"
        ? "Active"
        : itemFilters.status === "INACTIVE" ? "Inactive" : "Status"

    const openAddDialog = () => {
        resetItemForm()
        setIsFormOpen(true)
    }

    const openEditDialog = (item) => {
        handleEditItem(item)
        setIsFormOpen(true)
    }

    const openDetailDialog = (item) => {
        setSelectedItemId(item.id)
        setIsDetailOpen(true)
    }

    const onSubmit = async (event) => {
        try {
            await handleItemSubmit(event)
            setIsFormOpen(false)
        } catch {
            // Error sudah ditampilkan oleh toast di AssetContext.
        }
    }

    return (
        <ModuleGuard moduleId="items">
            <SectionHeader
                title="Item Management"
                action={canManageItems ? (
                    <Button type="button" onClick={openAddDialog}>
                        <Plus className="size-4" />
                        Add Item
                    </Button>
                ) : null}
            />

            {(errors.items || errors.masterData || errors.itemDetail) && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">
                        {errors.items || errors.masterData || errors.itemDetail}
                    </CardContent>
                </Card>
            )}

            <Card className="border-white/60 bg-white/85 shadow-sm">
                <CardHeader>
                    <CardTitle>List Items</CardTitle>
                    <CardDescription>All items managed within the system.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <Input
                            value={itemSearch}
                            onChange={(event) => {
                                setItemSearch(event.target.value)
                                setItemPage(1)
                            }}
                            placeholder="Search by item name"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedCategoryName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => { setItemFilters((current) => ({ ...current, categoryId: "all" })); setItemPage(1) }}>
                                    Semua kategori
                                </DropdownMenuItem>
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.id} onClick={() => { setItemFilters((current) => ({ ...current, categoryId: category.id })); setItemPage(1) }}>
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
                                <DropdownMenuItem onClick={() => { setItemFilters((current) => ({ ...current, locationId: "all" })); setItemPage(1) }}>
                                    Semua lokasi
                                </DropdownMenuItem>
                                {locations.map((location) => (
                                    <DropdownMenuItem key={location.id} onClick={() => { setItemFilters((current) => ({ ...current, locationId: location.id })); setItemPage(1) }}>
                                        {location.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-white px-2.5 text-sm">
                                    {selectedStatusName}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                                <DropdownMenuItem onClick={() => { setItemFilters((current) => ({ ...current, status: "all" })); setItemPage(1) }}>Semua status</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setItemFilters((current) => ({ ...current, status: "ACTIVE" })); setItemPage(1) }}>Active</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setItemFilters((current) => ({ ...current, status: "INACTIVE" })); setItemPage(1) }}>Inactive</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!paginatedItems.length && !loading.items ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-500">Tidak ada item yang cocok dengan filter saat ini.</TableCell>
                                    </TableRow>
                                ) : paginatedItems.map((item) => (
                                    <TableRow key={item.id} className={selectedItem?.id === item.id ? "bg-slate-50" : ""}>
                                        <TableCell>
                                            <button type="button" className="text-left" onClick={() => openDetailDialog(item)}>
                                                <p className="font-medium text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.sku}</p>
                                            </button>
                                        </TableCell>
                                        <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                                        <TableCell>{getLocationName(item.locationId)}</TableCell>
                                        <TableCell>{item.stock} {item.unit}</TableCell>
                                        <TableCell><DataPill>{item.status}</DataPill></TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" size="icon" variant="outline" onClick={() => openDetailDialog(item)}>
                                                    <Eye className="size-4" />
                                                </Button>
                                                {modulePermissions.items?.update && (
                                                    <Button type="button" size="icon" variant="outline" onClick={() => openEditDialog(item)}>
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                )}
                                                {modulePermissions.items?.delete && (
                                                    <Button type="button" size="icon" variant="outline" onClick={() => handleArchiveItem(item.id)}>
                                                        {item.status === "ACTIVE" ? <CircleCheck className="size-4" /> : <CircleX className="size-4" />}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Showing {paginatedItems.length} of {filteredItems.length} items</p>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="icon" disabled={visibleItemPage === 1} onClick={() => setItemPage((current) => Math.max(1, current - 1))}><ChevronLeft className="size-4" /></Button>
                            <span className="text-sm text-slate-600">{visibleItemPage} / {totalItemPages}</span>
                            <Button type="button" variant="outline" size="icon" disabled={visibleItemPage === totalItemPages} onClick={() => setItemPage((current) => Math.min(totalItemPages, current + 1))}><ChevronRight className="size-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ItemFormDialog
                isOpen={isFormOpen}
                setIsOpen={setIsFormOpen}
                editingItemId={editingItemId}
                itemForm={itemForm}
                setItemForm={setItemForm}
                categories={categories}
                locations={locations}
                suppliers={suppliers}
                loading={loading}
                onSubmit={onSubmit}
            />
            <ItemDetailDialog
                item={isDetailOpen ? selectedItem : null}
                onOpenChange={setIsDetailOpen}
                getCategoryName={getCategoryName}
                getLocationName={getLocationName}
                getSupplierName={getSupplierName}
                handleExportItem={handleExportItem}
                canExport={modulePermissions.items?.export}
            />
        </ModuleGuard>
    )
}
