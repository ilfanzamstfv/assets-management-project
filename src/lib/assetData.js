export const initialCategories = [
    { id: "cat-1", name: "Laptop" },
    { id: "cat-2", name: "Networking" },
    { id: "cat-3", name: "Furniture" },
    { id: "cat-4", name: "Peripheral" },
]

export const initialLocations = [
    { id: "loc-1", name: "Jakarta HQ" },
    { id: "loc-2", name: "Bandung Office" },
    { id: "loc-3", name: "Warehouse A" },
]

export const initialSuppliers = [
    { id: "sup-1", name: "PT Sinar Teknologi" },
    { id: "sup-2", name: "CV Ruang Kerja" },
    { id: "sup-3", name: "Nusa Digital Supply" },
]

export const initialItems = [
    {
        id: "item-1",
        name: "MacBook Pro 14",
        sku: "LTP-001",
        categoryId: "cat-1",
        locationId: "loc-1",
        supplierId: "sup-1",
        stock: 12,
        unit: "unit",
        latestPrice: 32500000,
        description: "Laptop untuk tim engineering dan design.",
        status: "Active",
        createdAt: "2026-06-10T08:00:00Z",
        updatedAt: "2026-06-26T10:00:00Z",
    },
    {
        id: "item-2",
        name: "Cisco Switch 24 Port",
        sku: "NET-024",
        categoryId: "cat-2",
        locationId: "loc-3",
        supplierId: "sup-3",
        stock: 8,
        unit: "pcs",
        latestPrice: 12800000,
        description: "Switch utama untuk distribusi jaringan kantor.",
        status: "Active",
        createdAt: "2026-05-18T08:00:00Z",
        updatedAt: "2026-06-20T10:00:00Z",
    },
    {
        id: "item-3",
        name: "Ergonomic Chair",
        sku: "FUR-014",
        categoryId: "cat-3",
        locationId: "loc-2",
        supplierId: "sup-2",
        stock: 20,
        unit: "unit",
        latestPrice: 2750000,
        description: "Kursi kerja untuk setup operasional harian.",
        status: "Active",
        createdAt: "2026-04-12T08:00:00Z",
        updatedAt: "2026-06-24T10:00:00Z",
    },
    {
        id: "item-4",
        name: "Mechanical Keyboard",
        sku: "PRF-118",
        categoryId: "cat-4",
        locationId: "loc-1",
        supplierId: "sup-1",
        stock: 30,
        unit: "pcs",
        latestPrice: 1450000,
        description: "Keyboard untuk workstation karyawan baru.",
        status: "Active",
        createdAt: "2026-03-01T08:00:00Z",
        updatedAt: "2026-06-18T10:00:00Z",
    },
]

export const initialPurchases = [
    {
        id: "pur-1",
        itemId: "item-1",
        supplierId: "sup-1",
        quantity: 4,
        unitPrice: 32500000,
        purchaseDate: "2026-06-26",
        notes: "Pengadaan onboarding batch Juni.",
        enteredBy: "Alya Pratama",
        createdAt: "2026-06-26T09:45:00Z",
    },
    {
        id: "pur-2",
        itemId: "item-2",
        supplierId: "sup-3",
        quantity: 2,
        unitPrice: 12800000,
        purchaseDate: "2026-06-20",
        notes: "Penambahan kapasitas jaringan gudang.",
        enteredBy: "Raka Dinata",
        createdAt: "2026-06-20T07:30:00Z",
    },
    {
        id: "pur-3",
        itemId: "item-3",
        supplierId: "sup-2",
        quantity: 10,
        unitPrice: 2750000,
        purchaseDate: "2026-06-14",
        notes: "Refresh furniture area operasional.",
        enteredBy: "Nadya Putri",
        createdAt: "2026-06-14T11:15:00Z",
    },
]

export const initialUsers = [
    { id: "usr-1", name: "Alya Pratama", email: "alya@authora.id", role: "Admin", status: "Active" },
    { id: "usr-2", name: "Dimas Wicaksono", email: "dimas@authora.id", role: "Manager", status: "Active" },
    { id: "usr-3", name: "Nadya Putri", email: "nadya@authora.id", role: "Staff", status: "Active" },
    { id: "usr-4", name: "Raka Dinata", email: "raka@authora.id", role: "Viewer", status: "Inactive" },
]

export const defaultPermissions = {
    Admin: {
        dashboard: { read: true, create: false, update: false, delete: false, export: false },
        items: { read: true, create: true, update: true, delete: true, export: true },
        stock: { read: true, create: false, update: false, delete: false, export: false },
        purchases: { read: true, create: true, update: true, delete: true, export: false },
        users: { read: true, create: true, update: true, delete: true, export: false },
    },
    Manager: {
        dashboard: { read: true, create: false, update: false, delete: false, export: false },
        items: { read: true, create: true, update: true, delete: true, export: true },
        stock: { read: true, create: false, update: false, delete: false, export: false },
        purchases: { read: true, create: false, update: true, delete: true, export: false },
        users: { read: false, create: false, update: false, delete: false, export: false },
    },
    Staff: {
        dashboard: { read: true, create: false, update: false, delete: false, export: false },
        items: { read: true, create: true, update: false, delete: false, export: true },
        stock: { read: true, create: false, update: false, delete: false, export: false },
        purchases: { read: true, create: true, update: false, delete: false, export: false },
        users: { read: false, create: false, update: false, delete: false, export: false },
    },
    Viewer: {
        dashboard: { read: true, create: false, update: false, delete: false, export: false },
        items: { read: true, create: false, update: false, delete: false, export: true },
        stock: { read: true, create: false, update: false, delete: false, export: false },
        purchases: { read: false, create: false, update: false, delete: false, export: false },
        users: { read: false, create: false, update: false, delete: false, export: false },
    },
}
