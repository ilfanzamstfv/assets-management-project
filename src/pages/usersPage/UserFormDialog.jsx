import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function UserFormDialog({
    isDialogOpen,
    setIsDialogOpen,
    editingUserId,
    userForm,
    setUserForm,
    roles,
    loading,
    onSubmit
}) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingUserId ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>{editingUserId ? "Edit user and assign role." : "Add user and assign role."}</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 pt-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                        <Label>Username <span className="text-red-500">*</span></Label>
                        <Input value={userForm.name} onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))} placeholder="Enter username" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email <span className="text-red-500">*</span></Label>
                        <Input type="email" value={userForm.email} onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} placeholder="Enter email user" />
                    </div>
                    <div className="space-y-2">
                        <Label>Password {editingUserId ? "" : <span className="text-red-500">*</span>}</Label>
                        <Input type="password" value={userForm.password} onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))} placeholder={editingUserId ? "New password (optional)" : "Enter password"} />
                    </div>
                    <div className="space-y-2">
                        <Label>Role <span className="text-red-500">*</span></Label>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex w-full h-9 items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-sm">
                                    {userForm.roleId ? roles.find((r) => String(r.id) === String(userForm.roleId))?.name : "Select role"}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                                <DropdownMenuItem onClick={() => setUserForm((current) => ({ ...current, roleId: "" }))}>
                                    Select role
                                </DropdownMenuItem>
                                {roles.map((role) => (
                                    <DropdownMenuItem key={role.id} onClick={() => setUserForm((current) => ({ ...current, roleId: role.id }))}>
                                        {role.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="space-y-2">
                        <Label>Status <span className="text-red-500">*</span></Label>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className="flex w-full h-9 items-center justify-between rounded-lg border border-input bg-background px-3 text-sm shadow-sm">
                                    {userForm.status === "ACTIVE" ? "Active" : "Inactive"}
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                                <DropdownMenuItem onClick={() => setUserForm((current) => ({ ...current, status: "ACTIVE" }))}>
                                    Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setUserForm((current) => ({ ...current, status: "INACTIVE" }))}>
                                    Inactive
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading.saveUser}>
                            {loading.saveUser ? "Saving..." : editingUserId ? "Save User" : "Add User"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
