import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Pencil, Plus, Trash2 } from "lucide-react"
import ModuleGuard from "@/components/asset/ModuleGuard"
import { SectionHeader } from "@/components/asset/AssetUI"
import { Badge } from "@/components/ui/badge"
import { useAsset } from "@/hooks/useAsset"
import { useAuth } from "@/hooks/useAuth"
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
import UserFormDialog from "./UserFormDialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function UsersPage() {
    const {
        permissions,
        users,
        roles,
        availablePermissions,
        editingUserId,
        userForm,
        setUserForm,
        resetUserForm,
        handleUserSubmit,
        handleEditUser,
        handleDeleteUser,
        handleTogglePermission,
        loading,
        errors,
    } = useAsset()

    const { user } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deleteUserId, setDeleteUserId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedRole, setSelectedRole] = useState("")
    const itemsPerPage = 10

    const activeRole = selectedRole || Object.keys(permissions)[0] || ""

    const permissionModules = Array.from(
        new Set(availablePermissions.map((permission) => permission.module))
    )
    const permissionActions = Array.from(
        new Set(availablePermissions.map((permission) => permission.action))
    )

    const onEditClick = (entry) => {
        handleEditUser(entry)
        setIsDialogOpen(true)
    }

    const onAddClick = () => {
        resetUserForm()
        setIsDialogOpen(true)
    }

    const onSubmit = async (e) => {
        try {
            await handleUserSubmit(e)
            setIsDialogOpen(false)
        } catch {
            // Error sudah ditampilkan oleh toast di AssetContext.
        }
    }

    const handleConfirmDelete = async () => {
        if (!deleteUserId) return
        await handleDeleteUser(deleteUserId)
        setDeleteUserId(null)
    }

    const currentUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return users.slice(start, start + itemsPerPage);
    }, [users, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(users.length / itemsPerPage)

    return (
        <ModuleGuard moduleId="users">
            <SectionHeader
                title="Users & Role Management"
                description="Manage user accounts, roles, and permission matrices on a granular, per-module basis."
                action={
                    <Button onClick={onAddClick} className="gap-2 ">
                        <Plus className="size-4" />
                        Add User
                    </Button>
                }
            />

            {(errors.users || errors.roles) && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6 text-sm text-red-600">{errors.users || errors.roles}</CardContent>
                </Card>
            )}

            <UserFormDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                editingUserId={editingUserId}
                userForm={userForm}
                setUserForm={setUserForm}
                roles={roles}
                loading={loading}
                onSubmit={onSubmit}
            />

            <div className="grid gap-6">
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>List Users</CardTitle>
                        <CardDescription>Control status and role of each account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentUsers.map((entry) => (
                                            <TableRow key={entry.id}>
                                                <TableCell>
                                                    <p className="font-medium text-slate-900">{entry.name}</p>
                                                    <p className="text-sm text-slate-500">{entry.email}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={entry.role?.name.toLowerCase() ===
                                                            "admin" ? "admin" : entry.role?.name.toLowerCase() ===
                                                                "manager" ? "manager" : entry.role?.name.toLowerCase() ===
                                                                    "staff" ? "staff" : entry.role?.name.toLowerCase() ===
                                                                        "viewer" ? "viewer" : "secondary"}>
                                                        {entry.role?.name || "-"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={entry.status.toLowerCase() === "active" ? "active" : "inactive"}>{entry.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button type="button" size="icon" variant="outline" onClick={() => onEditClick(entry)}>
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className="text-red-600"
                                                            onClick={() => setDeleteUserId(entry.id)}
                                                            disabled={Number(entry.id) === Number(user?.id)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {totalPages > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)) }}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href="#"
                                                isActive={currentPage === i + 1}
                                                onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)) }}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>

                {/* Permission Table */}
                <Card className="border-white/60 bg-white/85 shadow-sm">
                    <CardHeader>
                        <CardTitle>Permission</CardTitle>
                        <CardDescription>Configure access rights by role.</CardDescription>
                        <div className="flex flex-wrap gap-2 pt-4">
                            {Object.keys(permissions).map((roleName) => (
                                <Button
                                    key={roleName}
                                    variant={activeRole === roleName ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedRole(roleName)}
                                    className="rounded-full"
                                >
                                    {roleName}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-slate-500">
                                <tr>
                                    <th className="pb-3 font-medium">Module</th>
                                    {permissionActions.map((action) => (
                                        <th key={action} className="pb-3 font-medium capitalize text-center">{action}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {activeRole && permissionModules.map((moduleId) => (
                                    <tr key={`${activeRole}-${moduleId}`} className="border-t border-slate-100">
                                        <td className="py-3 capitalize font-medium text-slate-900">{moduleId}</td>
                                        {permissionActions.map((action) => (
                                            <td key={action} className="py-3">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        checked={Boolean(permissions[activeRole]?.[moduleId]?.[action])}
                                                        onCheckedChange={() => handleTogglePermission(activeRole, moduleId, action)}
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this user account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="logout"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ModuleGuard>
    )
}
