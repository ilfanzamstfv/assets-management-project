import { useEffect, useMemo, useState } from "react"

import { gooeyToast } from "@/components/ui/goey-toaster"
import AssetContext from "@/context/asset-context"
import { useAuth } from "@/hooks/useAuth"
import {
    archiveItem,
    createCategory,
    createItem,
    createLocation,
    createPurchaseHistory,
    createSupplier,
    createUser,
    deleteCategory,
    deleteLocation,
    deletePurchaseHistory,
    deleteSupplier,
    downloadItemPdf,
    getCategories,
    getDashboardSummary,
    getItemById,
    getItems,
    getLocations,
    getPermissions,
    getPurchaseHistories,
    getRoles,
    getStockItems,
    getSuppliers,
    getUsers,
    resetUserPassword,
    updateItem,
    updateCategory,
    updateLocation,
    updateSupplier,
    updateRolePermissions,
    updateUser,
} from "@/services/assets"
import {
    emptyItemForm,
    emptyPurchaseForm,
    emptyUserForm,
    moduleConfig,
    pageSize,
    permissionListToMap,
} from "@/lib/assetUtils"

const createEmptyLoading = () => ({
    bootstrap: true,
    dashboard: false,
    items: false,
    itemDetail: false,
    stock: false,
    purchases: false,
    users: false,
    roles: false,
    masterData: false,
    saveItem: false,
    savePurchase: false,
    saveUser: false,
    savePermissions: false,
})

export function AssetProvider({ children }) {
    const { user, fetchUser } = useAuth()
    const [dashboardMetrics, setDashboardMetrics] = useState({
        totalItems: 0,
        totalStock: 0,
        totalAssetValue: 0,
        categoryBreakdown: [],
        locationBreakdown: [],
        latestPurchases: [],
    })
    const [categories, setCategories] = useState([])
    const [locations, setLocations] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [items, setItems] = useState([])
    const [itemsMeta, setItemsMeta] = useState({ total: 0, page: 1, limit: pageSize, totalPages: 1 })
    const [stockMeta, setStockMeta] = useState({ total: 0, page: 1, limit: 100, totalPages: 1 })
    const [stockItems, setStockItems] = useState([])
    const [purchaseMeta, setPurchaseMeta] = useState({ total: 0, page: 1, limit: 100, totalPages: 1 })
    const [purchases, setPurchases] = useState([])
    const [users, setUsers] = useState([])
    const [usersMeta, setUsersMeta] = useState({ total: 0, page: 1, limit: 100, totalPages: 1 })
    const [roles, setRoles] = useState([])
    const [availablePermissions, setAvailablePermissions] = useState([])
    const [permissionsByRole, setPermissionsByRole] = useState({})
    const [selectedItemId, setSelectedItemId] = useState("")
    const [selectedItemDetail, setSelectedItemDetail] = useState(null)
    const [editingItemId, setEditingItemId] = useState("")
    const [editingUserId, setEditingUserId] = useState("")
    const [itemForm, setItemForm] = useState(emptyItemForm)
    const [purchaseForm, setPurchaseForm] = useState({
        ...emptyPurchaseForm,
        purchaseDate: new Date().toISOString().slice(0, 10),
    })
    const [userForm, setUserForm] = useState(emptyUserForm)
    const [itemSearch, setItemSearch] = useState("")
    const [itemFilters, setItemFilters] = useState({
        categoryId: "all",
        locationId: "all",
        supplierId: "all",
        status: "all",
    })
    const [itemPage, setItemPage] = useState(1)
    const [stockSearch, setStockSearch] = useState("")
    const [stockFilters, setStockFilters] = useState({
        categoryId: "all",
        locationId: "all",
        sort: "highest",
    })
    const [purchaseFilters, setPurchaseFilters] = useState({
        itemId: "all",
        supplierId: "all",
        date: "",
    })
    const [masterForm, setMasterForm] = useState({
        category: "",
        location: "",
        supplier: "",
    })
    const [loading, setLoading] = useState(createEmptyLoading())
    const [errors, setErrors] = useState({})

    const currentRole = user?.role?.name || "Guest"
    const currentUserName = user?.name || "Asset Team"
    const currentPermissionMap = useMemo(() => permissionListToMap(user?.role), [user])

    const modulePermissions = useMemo(
        () => ({
            dashboard: currentPermissionMap.dashboard || {},
            items: {
                ...(currentPermissionMap.item || {}),
                export: Boolean(currentPermissionMap.export_pdf?.export),
            },
            stock: currentPermissionMap.stock || {},
            purchases: currentPermissionMap.purchase_history || {},
            users: {
                manage: Boolean(currentPermissionMap.user_management?.manage),
                roleManage: Boolean(currentPermissionMap.role_management?.manage),
            },
            categories: currentPermissionMap.category || {},
            locations: currentPermissionMap.location || {},
            suppliers: currentPermissionMap.supplier || {},
        }),
        [currentPermissionMap]
    )

    const accessibleModules = useMemo(
        () =>
            moduleConfig.filter((module) => {
                if (module.id === "master-data") {
                    return currentRole?.toLowerCase() === "admin"
                }
                if (module.id === "users") {
                    return modulePermissions.users.manage || modulePermissions.users.roleManage
                }
                return Boolean(currentPermissionMap[module.permissionModule]?.[module.permissionAction])
            }),
        [currentPermissionMap, modulePermissions.users.manage, modulePermissions.users.roleManage, currentRole]
    )

    const selectedItem = useMemo(() => {
        const baseItem = items.find((item) => item.id === selectedItemId) || items[0] || null
        return selectedItemDetail || baseItem
    }, [items, selectedItemDetail, selectedItemId])

    const visibleItemPage = Math.min(itemPage, itemsMeta.totalPages || 1)
    const paginatedItems = items
    const filteredItems = items
    const filteredStockItems = stockItems
    const filteredPurchases = purchases

    const getCategoryName = (id) => categories.find((entry) => entry.id === Number(id))?.name || "-"
    const getLocationName = (id) => locations.find((entry) => entry.id === Number(id))?.name || "-"
    const getSupplierName = (id) => suppliers.find((entry) => entry.id === Number(id))?.name || "-"
    const getItemName = (id) => items.find((entry) => entry.id === Number(id))?.name || "-"

    const updateLoading = (key, value) => {
        setLoading((current) => ({ ...current, [key]: value }))
    }

    const setErrorFor = (key, value) => {
        setErrors((current) => ({ ...current, [key]: value }))
    }

    const mapDashboardSummary = (summary) => ({
        totalItems: summary?.totalItems || 0,
        totalStock: (summary?.recentPurchases || []).reduce((sum, purchase) => sum + Number(purchase?.item?.stock || 0), 0)
            || items.reduce((sum, item) => sum + Number(item.stock || 0), 0),
        totalAssetValue: Number(summary?.totalAssetValue || 0),
        categoryBreakdown: (summary?.itemsByCategory || []).map((entry) => ({
            id: entry.categoryId,
            label: entry.categoryName,
            value: entry.totalItems,
        })),
        locationBreakdown: (summary?.itemsByLocation || []).map((entry) => ({
            id: entry.locationId,
            label: entry.locationName,
            value: entry.totalItems,
        })),
        latestPurchases: (summary?.recentPurchases || []).map((purchase) => ({
            id: purchase.id,
            itemId: purchase.itemId,
            itemName: purchase.item?.name,
            supplierId: purchase.supplierId,
            supplierName: purchase.supplier?.name,
            quantity: purchase.quantity,
            unitPrice: Number(purchase.unitPrice || 0),
            purchaseDate: purchase.purchaseDate,
            enteredBy: purchase.inputBy?.name || "-",
        })),
    })

    const mapPurchase = (purchase) => ({
        ...purchase,
        unitPrice: Number(purchase.unitPrice || 0),
        totalPrice: Number(purchase.totalPrice || 0),
        note: purchase.note || "",
        itemName: purchase.item?.name,
        supplierName: purchase.supplier?.name,
        enteredBy: purchase.inputBy?.name || "-",
    })

    const mapRoleMatrix = (roleList) =>
        roleList.reduce((acc, role) => {
            acc[role.name] = (role.permissions || []).reduce((moduleAcc, entry) => {
                const permission = entry.permission
                if (!permission) return moduleAcc
                if (!moduleAcc[permission.module]) {
                    moduleAcc[permission.module] = {}
                }
                moduleAcc[permission.module][permission.action] = true
                return moduleAcc
            }, {})
            return acc
        }, {})

    const fetchMasterData = async () => {
        updateLoading("masterData", true)
        try {
            const [categoriesRes, locationsRes, suppliersRes] = await Promise.all([
                getCategories({ page: 1, limit: 100 }),
                getLocations({ page: 1, limit: 100 }),
                getSuppliers({ page: 1, limit: 100 }),
            ])
            setCategories(categoriesRes.data)
            setLocations(locationsRes.data)
            setSuppliers(suppliersRes.data)
            setErrorFor("masterData", "")
        } catch (error) {
            setErrorFor("masterData", error.response?.data?.message || "Failed to load master data")
        } finally {
            updateLoading("masterData", false)
        }
    }

    const fetchDashboard = async () => {
        if (!modulePermissions.dashboard.read) return
        updateLoading("dashboard", true)
        try {
            const summary = await getDashboardSummary()
            setDashboardMetrics(mapDashboardSummary(summary))
            setErrorFor("dashboard", "")
        } catch (error) {
            setErrorFor("dashboard", error.response?.data?.message || "Failed to load dashboard")
        } finally {
            updateLoading("dashboard", false)
        }
    }

    const fetchItems = async () => {
        if (!modulePermissions.items.read) return
        updateLoading("items", true)
        try {
            const response = await getItems({
                page: itemPage,
                limit: pageSize,
                search: itemSearch || undefined,
                categoryId: itemFilters.categoryId !== "all" ? itemFilters.categoryId : undefined,
                locationId: itemFilters.locationId !== "all" ? itemFilters.locationId : undefined,
                supplierId: itemFilters.supplierId !== "all" ? itemFilters.supplierId : undefined,
                status: itemFilters.status !== "all" ? itemFilters.status : undefined,
            })
            setItems(response.data.map((item) => ({ ...item, lastPurchasePrice: Number(item.lastPurchasePrice || 0) })))
            setItemsMeta(response.meta)
            setErrorFor("items", "")
        } catch (error) {
            setErrorFor("items", error.response?.data?.message || "Failed to load items")
        } finally {
            updateLoading("items", false)
        }
    }

    const fetchItemDetail = async (id) => {
        if (!id || !modulePermissions.items.read) return
        updateLoading("itemDetail", true)
        try {
            const item = await getItemById(id)
            setSelectedItemDetail({
                ...item,
                lastPurchasePrice: Number(item.lastPurchasePrice || 0),
                purchaseHistories: (item.purchaseHistories || []).map(mapPurchase),
            })
            setErrorFor("itemDetail", "")
        } catch (error) {
            setSelectedItemDetail(null)
            setErrorFor("itemDetail", error.response?.data?.message || "Failed to load item detail")
        } finally {
            updateLoading("itemDetail", false)
        }
    }

    const fetchStock = async () => {
        if (!modulePermissions.stock.read) return
        updateLoading("stock", true)
        try {
            const sortMap = {
                highest: "highest-stock",
                lowest: "lowest-stock",
            }
            const response = await getStockItems({
                page: 1,
                limit: 100,
                search: stockSearch || undefined,
                categoryId: stockFilters.categoryId !== "all" ? stockFilters.categoryId : undefined,
                locationId: stockFilters.locationId !== "all" ? stockFilters.locationId : undefined,
                sort: sortMap[stockFilters.sort] || "name",
            })
            const normalizedStockItems = response.data.map((item) => ({
                ...item,
                lastPurchasePrice: Number(item.lastPurchasePrice || 0),
            }))
            setStockItems(normalizedStockItems)
            setStockMeta(response.meta)
            setDashboardMetrics((current) => ({
                ...current,
                totalStock: normalizedStockItems.reduce((sum, item) => sum + Number(item.stock || 0), 0),
            }))
            setErrorFor("stock", "")
        } catch (error) {
            setErrorFor("stock", error.response?.data?.message || "Failed to load stock")
        } finally {
            updateLoading("stock", false)
        }
    }

    const fetchPurchases = async () => {
        if (!modulePermissions.purchases.read) return
        updateLoading("purchases", true)
        try {
            const response = await getPurchaseHistories({
                page: 1,
                limit: 100,
                itemId: purchaseFilters.itemId !== "all" ? purchaseFilters.itemId : undefined,
                supplierId: purchaseFilters.supplierId !== "all" ? purchaseFilters.supplierId : undefined,
                startDate: purchaseFilters.date || undefined,
                endDate: purchaseFilters.date || undefined,
            })
            setPurchases(response.data.map(mapPurchase))
            setPurchaseMeta(response.meta)
            setErrorFor("purchases", "")
        } catch (error) {
            setErrorFor("purchases", error.response?.data?.message || "Failed to load purchase histories")
        } finally {
            updateLoading("purchases", false)
        }
    }

    const fetchUsersAndRoles = async () => {
        if (!(modulePermissions.users.manage || modulePermissions.users.roleManage)) return
        updateLoading("users", true)
        updateLoading("roles", true)
        try {
            const requests = [
                modulePermissions.users.manage ? getUsers({ page: 1, limit: 100 }) : Promise.resolve({ data: [], meta: usersMeta }),
                modulePermissions.users.roleManage ? getRoles() : Promise.resolve([]),
                modulePermissions.users.roleManage ? getPermissions() : Promise.resolve([]),
            ]
            const [usersRes, rolesRes, permissionsRes] = await Promise.all(requests)
            setUsers(usersRes.data || [])
            setUsersMeta(usersRes.meta || usersMeta)
            setRoles(Array.isArray(rolesRes) ? rolesRes : [])
            setAvailablePermissions(Array.isArray(permissionsRes) ? permissionsRes : [])
            setPermissionsByRole(mapRoleMatrix(Array.isArray(rolesRes) ? rolesRes : []))
            setErrorFor("users", "")
            setErrorFor("roles", "")
        } catch (error) {
            const message = error.response?.data?.message || "Failed to load user management data"
            setErrorFor("users", message)
            setErrorFor("roles", message)
        } finally {
            updateLoading("users", false)
            updateLoading("roles", false)
        }
    }

    const resetItemForm = () => {
        setEditingItemId("")
        setItemForm(emptyItemForm)
    }

    const resetUserForm = () => {
        setEditingUserId("")
        setUserForm(emptyUserForm)
    }

    const saveItem = async () => {
        const payload = {
            name: itemForm.name,
            sku: itemForm.sku,
            categoryId: Number(itemForm.categoryId),
            locationId: Number(itemForm.locationId),
            supplierId: Number(itemForm.supplierId),
            stock: Number(itemForm.stock),
            unit: itemForm.unit,
            lastPurchasePrice: Number(itemForm.lastPurchasePrice || 0),
            description: itemForm.description,
            status: itemForm.status,
        }
        if (editingItemId) {
            await updateItem(editingItemId, payload)
            gooeyToast.success("Item updated", { description: "Perubahan item berhasil disimpan.", preset: "smooth" })
        } else {
            await createItem(payload)
            gooeyToast.success("Item created", { description: "Item baru berhasil ditambahkan.", preset: "smooth" })
        }
        resetItemForm()
        await Promise.all([fetchItems(), fetchStock(), fetchDashboard()])
    }

    const handleItemSubmit = async (event) => {
        event.preventDefault()
        updateLoading("saveItem", true)
        try {
            await saveItem()
        } catch (error) {
            gooeyToast.error("Item failed", {
                description: error.response?.data?.message || "Failed to save item",
                preset: "smooth",
            })
        } finally {
            updateLoading("saveItem", false)
        }
    }

    const handleEditItem = (item) => {
        setEditingItemId(item.id)
        setItemForm({
            name: item.name || "",
            sku: item.sku || "",
            categoryId: String(item.categoryId || ""),
            locationId: String(item.locationId || ""),
            supplierId: String(item.supplierId || ""),
            stock: String(item.stock ?? ""),
            unit: item.unit || "unit",
            lastPurchasePrice: String(Number(item.lastPurchasePrice || 0)),
            description: item.description || "",
            status: item.status || "ACTIVE",
        })
    }

    const handleArchiveItem = async (itemId) => {
        try {
            await archiveItem(itemId)
            gooeyToast.success("Item archived", {
                description: "Status item berhasil diubah menjadi inactive.",
                preset: "smooth",
            })
            await Promise.all([fetchItems(), fetchStock(), fetchDashboard()])
        } catch (error) {
            gooeyToast.error("Archive failed", {
                description: error.response?.data?.message || "Failed to archive item",
                preset: "smooth",
            })
        }
    }

    const handlePurchaseSubmit = async (event) => {
        event.preventDefault()
        updateLoading("savePurchase", true)
        try {
            await createPurchaseHistory({
                itemId: Number(purchaseForm.itemId),
                supplierId: Number(purchaseForm.supplierId),
                quantity: Number(purchaseForm.quantity),
                unitPrice: Number(purchaseForm.unitPrice),
                purchaseDate: purchaseForm.purchaseDate,
                note: purchaseForm.note,
            })
            setPurchaseForm({
                ...emptyPurchaseForm,
                purchaseDate: new Date().toISOString().slice(0, 10),
            })
            gooeyToast.success("Purchase saved", {
                description: "Purchase history berhasil ditambahkan.",
                preset: "smooth",
            })
            await Promise.all([fetchPurchases(), fetchItems(), fetchStock(), fetchDashboard()])
            if (selectedItemId) {
                await fetchItemDetail(selectedItemId)
            }
        } catch (error) {
            gooeyToast.error("Purchase failed", {
                description: error.response?.data?.message || "Failed to save purchase",
                preset: "smooth",
            })
        } finally {
            updateLoading("savePurchase", false)
        }
    }

    const handleDeletePurchase = async (purchaseId) => {
        try {
            await deletePurchaseHistory(purchaseId)
            gooeyToast.success("Purchase deleted", {
                description: "Riwayat pembelian berhasil dihapus.",
                preset: "smooth",
            })
            await Promise.all([fetchPurchases(), fetchItems(), fetchStock(), fetchDashboard()])
            if (selectedItemId) {
                await fetchItemDetail(selectedItemId)
            }
        } catch (error) {
            gooeyToast.error("Delete failed", {
                description: error.response?.data?.message || "Failed to delete purchase",
                preset: "smooth",
            })
        }
    }

    const handleUserSubmit = async (event) => {
        event.preventDefault()
        updateLoading("saveUser", true)
        try {
            const payload = {
                name: userForm.name,
                email: userForm.email,
                roleId: Number(userForm.roleId),
                status: userForm.status,
                ...(userForm.password ? { password: userForm.password } : {}),
            }
            if (editingUserId) {
                await updateUser(editingUserId, payload)
                gooeyToast.success("User updated", { description: "User berhasil diperbarui.", preset: "smooth" })
                if (Number(editingUserId) === Number(user?.id)) {
                    await fetchUser()
                }
            } else {
                await createUser(payload)
                gooeyToast.success("User created", { description: "User baru berhasil ditambahkan.", preset: "smooth" })
            }
            resetUserForm()
            await fetchUsersAndRoles()
        } catch (error) {
            gooeyToast.error("User failed", {
                description: error.response?.data?.message || "Failed to save user",
                preset: "smooth",
            })
        } finally {
            updateLoading("saveUser", false)
        }
    }

    const handleEditUser = (entry) => {
        setEditingUserId(entry.id)
        setUserForm({
            name: entry.name || "",
            email: entry.email || "",
            roleId: String(entry.roleId || entry.role?.id || ""),
            password: "",
            status: entry.status || "ACTIVE",
        })
    }

    const handleTogglePermission = async (roleName, moduleId, action) => {
        const role = roles.find((entry) => entry.name === roleName)
        if (!role) return

        const nextMatrix = {
            ...permissionsByRole,
            [roleName]: {
                ...(permissionsByRole[roleName] || {}),
                [moduleId]: {
                    ...((permissionsByRole[roleName] || {})[moduleId] || {}),
                    [action]: !((permissionsByRole[roleName] || {})[moduleId] || {})[action],
                },
            },
        }
        setPermissionsByRole(nextMatrix)

        const permissions = Object.entries(nextMatrix[roleName] || {}).flatMap(([moduleName, actions]) =>
            Object.entries(actions)
                .filter(([, allowed]) => allowed)
                .map(([actionName]) => ({ module: moduleName, action: actionName }))
        )

        updateLoading("savePermissions", true)
        try {
            await updateRolePermissions(role.id, { permissions })
            const updatedRoles = await getRoles()
            setRoles(updatedRoles)
            setPermissionsByRole(mapRoleMatrix(updatedRoles))
            if (user?.role?.name === roleName) {
                await fetchUser()
            }
            gooeyToast.success("Permissions updated", {
                description: `Permission untuk role ${roleName} berhasil diperbarui.`,
                preset: "smooth",
            })
        } catch (error) {
            gooeyToast.error("Permission failed", {
                description: error.response?.data?.message || "Failed to update role permissions",
                preset: "smooth",
            })
            setPermissionsByRole(mapRoleMatrix(roles))
        } finally {
            updateLoading("savePermissions", false)
        }
    }

    const handleAddMasterData = async (type, overrideValue = null) => {
        const value = (overrideValue !== null ? overrideValue : masterForm[type])?.trim()
        if (!value) return
        try {
            if (type === "category") await createCategory({ name: value })
            if (type === "location") await createLocation({ name: value })
            if (type === "supplier") await createSupplier({ name: value })
            setMasterForm((current) => ({ ...current, [type]: "" }))
            gooeyToast.success("Master data created", {
                description: `${value} berhasil ditambahkan.`,
                preset: "smooth",
            })
            await fetchMasterData()
        } catch (error) {
            gooeyToast.error("Master data failed", {
                description: error.response?.data?.message || "Failed to add master data",
                preset: "smooth",
            })
        }
    }

    const handleEditMasterData = async (type, id, value) => {
        if (!value?.trim()) return
        try {
            if (type === "category") await updateCategory(id, { name: value })
            if (type === "location") await updateLocation(id, { name: value })
            if (type === "supplier") await updateSupplier(id, { name: value })
            gooeyToast.success("Master data updated", {
                description: `${value} berhasil diperbarui.`,
                preset: "smooth",
            })
            await fetchMasterData()
        } catch (error) {
            gooeyToast.error("Update failed", {
                description: error.response?.data?.message || "Failed to update master data",
                preset: "smooth",
            })
        }
    }

    const handleRemoveMasterData = async (type, id) => {
        try {
            if (type === "category") await deleteCategory(id)
            if (type === "location") await deleteLocation(id)
            if (type === "supplier") await deleteSupplier(id)
            gooeyToast.success("Master data removed", {
                description: "Data berhasil dihapus.",
                preset: "smooth",
            })
            await fetchMasterData()
        } catch (error) {
            gooeyToast.error("Delete failed", {
                description: error.response?.data?.message || "Failed to delete master data",
                preset: "smooth",
            })
        }
    }

    const handleExportItem = async (item) => {
        if (!item?.id) return
        try {
            const response = await downloadItemPdf(item.id)
            const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))
            const link = document.createElement("a")
            const disposition = response.headers["content-disposition"] || ""
            const matched = disposition.match(/filename="?([^"]+)"?/)
            link.href = blobUrl
            link.download = matched?.[1] || `item-${item.id}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            gooeyToast.error("Export failed", {
                description: error.response?.data?.message || "Failed to export PDF",
                preset: "smooth",
            })
        }
    }

    useEffect(() => {
        if (!user) return

        let cancelled = false

        const bootstrap = async () => {
            try {
                await Promise.all([
                    fetchMasterData(),
                    fetchDashboard(),
                    fetchItems(),
                    fetchStock(),
                    fetchPurchases(),
                    fetchUsersAndRoles(),
                ])
            } finally {
                if (!cancelled) {
                    updateLoading("bootstrap", false)
                }
            }
        }

        bootstrap()

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        if (user && modulePermissions.items.read) {
            const run = async () => {
                await fetchItems()
            }

            run()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemSearch, itemFilters, itemPage, modulePermissions.items.read])

    useEffect(() => {
        if (user && modulePermissions.stock.read) {
            const run = async () => {
                await fetchStock()
            }

            run()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stockSearch, stockFilters, modulePermissions.stock.read])

    useEffect(() => {
        if (user && modulePermissions.purchases.read) {
            const run = async () => {
                await fetchPurchases()
            }

            run()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseFilters, modulePermissions.purchases.read])

    useEffect(() => {
        const targetId = selectedItemId || items[0]?.id
        if (targetId) {
            const run = async () => {
                await fetchItemDetail(targetId)
            }

            run()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedItemId, items])

    const value = {
        categories,
        locations,
        suppliers,
        items,
        purchases,
        users,
        roles,
        permissions: permissionsByRole,
        availablePermissions,
        selectedItemId,
        editingItemId,
        editingUserId,
        itemForm,
        purchaseForm,
        userForm,
        itemSearch,
        itemFilters,
        itemPage,
        stockSearch,
        stockFilters,
        purchaseFilters,
        masterForm,
        currentRole,
        currentUserName,
        modulePermissions,
        accessibleModules,
        selectedItem,
        dashboardMetrics,
        filteredItems,
        totalItemPages: itemsMeta.totalPages || 1,
        visibleItemPage,
        paginatedItems,
        filteredStockItems,
        filteredPurchases,
        loading,
        errors,
        usersMeta,
        purchaseMeta,
        stockMeta,
        itemsMeta,
        setSelectedItemId,
        setItemForm,
        setPurchaseForm,
        setUserForm,
        setItemSearch,
        setItemFilters,
        setItemPage,
        setStockSearch,
        setStockFilters,
        setPurchaseFilters,
        setMasterForm,
        getCategoryName,
        getLocationName,
        getSupplierName,
        getItemName,
        resetItemForm,
        resetUserForm,
        handleItemSubmit,
        handleEditItem,
        handleArchiveItem,
        handlePurchaseSubmit,
        handleDeletePurchase,
        handleUserSubmit,
        handleEditUser,
        handleTogglePermission,
        handleAddMasterData,
        handleEditMasterData,
        handleRemoveMasterData,
        handleExportItem,
        fetchItems,
        fetchDashboard,
        fetchStock,
        fetchPurchases,
        fetchUsersAndRoles,
        fetchMasterData,
        resetUserPassword,
    }

    return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
}
