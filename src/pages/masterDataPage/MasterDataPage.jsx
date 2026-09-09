import { useState, useMemo } from "react"
import { useAsset } from "@/hooks/useAsset"
import ModuleGuard from "@/components/asset/ModuleGuard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Pencil, Trash2, Plus } from "lucide-react"

export default function MasterDataPage({ type }) {
    const {
        categories,
        locations,
        suppliers,
        handleAddMasterData,
        handleEditMasterData,
        handleRemoveMasterData,
    } = useAsset()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [localForm, setLocalForm] = useState("")
    const [deleteId, setDeleteId] = useState(null)

    const config = useMemo(() => {
        switch (type) {
            case "category":
                return { title: "Category", description: "Manage category master data for items.", data: categories }
            case "location":
                return { title: "Location", description: "Manage location master data for stock storage.", data: locations }
            case "supplier":
                return { title: "Supplier", description: "Manage supplier master data for purchase history.", data: suppliers }
            default:
                return { title: "Unknown", description: "", data: [] }
        }
    }, [type, categories, locations, suppliers])

    const handleOpenAdd = () => {
        setEditingId(null)
        setLocalForm("")
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (id, name) => {
        setEditingId(id)
        setLocalForm(name)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editingId) {
            await handleEditMasterData(type, editingId, localForm)
        } else {
            await handleAddMasterData(type, localForm)
        }
        setIsDialogOpen(false)
    }

    const handleConfirmDelete = async () => {
        if (!deleteId) return
        await handleRemoveMasterData(type, deleteId)
        setDeleteId(null)
    }

    return (
        <ModuleGuard moduleId="master-data" type={type}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground">Master Data {config.title}</h2>
                        <p className="text-sm text-slate-500">{config.description}</p>
                    </div>
                    <Button onClick={handleOpenAdd} className="gap-2">
                        <Plus className="size-4" />
                        Add {config.title}
                    </Button>
                </div>

                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>List {config.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="w-16 text-center">No</TableHead>
                                        <TableHead>{config.title} Name</TableHead>
                                        <TableHead className="w-24 text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {config.data.length > 0 ? (
                                        config.data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center text-slate-500">{index + 1}</TableCell>
                                                <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(item.id, item.name)}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => setDeleteId(item.id)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center text-slate-500">
                                                Belum ada data {config.title.toLowerCase()}.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit" : "Tambah"} {config.title}</DialogTitle>
                            <DialogDescription>
                                Masukkan nama {config.title.toLowerCase()} yang baru.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama {config.title}</Label>
                                <Input
                                    id="name"
                                    value={localForm}
                                    onChange={(e) => setLocalForm(e.target.value)}
                                    placeholder={`Contoh: ${config.title === 'Kategori' ? 'Elektronik' : config.title === 'Lokasi' ? 'Gudang Utama' : 'PT. Maju Jaya'}`}
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={!localForm.trim()}>
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the {config.title.toLowerCase()} and remove its data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="logout" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmDelete}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </ModuleGuard>
    )
}
