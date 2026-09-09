import {
    Boxes,
    ChartColumn,
    LayoutDashboard,
    ShieldCheck,
    ShoppingCart,
    Database,
} from "lucide-react"

export const moduleConfig = [
    { id: "dashboard", permissionModule: "dashboard", permissionAction: "read", label: "Dashboard", icon: LayoutDashboard, path: "/home/dashboard" },
    { id: "items", permissionModule: "item", permissionAction: "read", label: "Item Management", icon: Boxes, path: "/home/items" },
    { id: "stock", permissionModule: "stock", permissionAction: "read", label: "Check Stock", icon: ChartColumn, path: "/home/stock" },
    { id: "purchases", permissionModule: "purchase_history", permissionAction: "read", label: "Purchase History", icon: ShoppingCart, path: "/home/purchases" },
    { id: "users", permissionModule: "user_management", permissionAction: "manage", label: "User & Role", icon: ShieldCheck, path: "/home/users" },
    {
        id: "master-data",
        permissionModule: "master-data",
        permissionAction: "manage",
        label: "Master Data",
        icon: Database,
        children: [
            { id: "md-categories", label: "Category", path: "/home/master-data/categories" },
            { id: "md-locations", label: "Location", path: "/home/master-data/locations" },
            { id: "md-suppliers", label: "Supplier", path: "/home/master-data/suppliers" },
        ]
    },
]

export const emptyItemForm = {
    name: "",
    sku: "",
    categoryId: "",
    locationId: "",
    supplierId: "",
    stock: "",
    unit: "unit",
    lastPurchasePrice: "",
    description: "",
    status: "ACTIVE",
}

export const emptyPurchaseForm = {
    itemId: "",
    supplierId: "",
    quantity: "",
    unitPrice: "",
    purchaseDate: "",
    note: "",
}

export const emptyUserForm = {
    name: "",
    email: "",
    roleId: "",
    password: "",
    status: "ACTIVE",
}

export const pageSize = 5

export function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0))
}

export function formatCompactCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(Number(value || 0))
}

export function buildPurchaseTrend(purchases, days = 30) {
    const labelFormat = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
    })
    const dayMs = 24 * 60 * 60 * 1000
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = today.getTime() - (days - 1) * dayMs

    const buckets = new Map()
    for (let i = 0; i < days; i += 1) {
        const time = start + i * dayMs
        buckets.set(time, {
            date: labelFormat.format(new Date(time)),
            value: 0,
            qty: 0,
        })
    }

    ; (purchases || []).forEach((purchase) => {
        if (!purchase?.purchaseDate) return
        const time = new Date(purchase.purchaseDate).setHours(0, 0, 0, 0)
        const bucket = buckets.get(time)
        if (!bucket) return
        const quantity = Number(purchase.quantity || 0)
        bucket.qty += quantity
        bucket.value += quantity * Number(purchase.unitPrice || 0)
    })

    return Array.from(buckets.values())
}

export function formatDate(value) {
    if (!value) return "-"
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value))
}

export function makeId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function toDisplayStatus(value) {
    if (value === "ACTIVE") return "Active"
    if (value === "INACTIVE") return "Inactive"
    return value || "-"
}

export function permissionListToMap(role) {
    const permissions = role?.permissions || []
    const map = {}

    permissions.forEach((entry) => {
        const permission = entry.permission || entry
        const moduleName = permission?.module
        const actionName = permission?.action
        if (!moduleName || !actionName) return
        if (!map[moduleName]) map[moduleName] = {}
        map[moduleName][actionName] = true
    })

    return map
}
