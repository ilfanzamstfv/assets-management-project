import api from "@/lib/api"

const normalizeListResponse = (response) => ({
    data: response.data?.data || [],
    meta: response.data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
})

const normalizeEntityResponse = (response) => response.data?.data || response.data

export const getDashboardSummary = async () => normalizeEntityResponse(await api.get("/dashboard"))

export const getItems = async (params = {}) => normalizeListResponse(await api.get("/items", { params }))
export const getItemById = async (id) => normalizeEntityResponse(await api.get(`/items/${id}`))
export const createItem = async (data) => normalizeEntityResponse(await api.post("/items", data))
export const updateItem = async (id, data) => normalizeEntityResponse(await api.put(`/items/${id}`, data))
export const archiveItem = async (id) => normalizeEntityResponse(await api.delete(`/items/${id}`))
export const downloadItemPdf = async (id) =>
    api.get(`/items/${id}/export/pdf`, { responseType: "blob" })

export const getStockItems = async (params = {}) => normalizeListResponse(await api.get("/items/stock", { params }))

export const getCategories = async (params = {}) => normalizeListResponse(await api.get("/categories", { params }))
export const createCategory = async (data) => normalizeEntityResponse(await api.post("/categories", data))
export const updateCategory = async (id, data) => normalizeEntityResponse(await api.put(`/categories/${id}`, data))
export const deleteCategory = async (id) => api.delete(`/categories/${id}`)

export const getLocations = async (params = {}) => normalizeListResponse(await api.get("/locations", { params }))
export const createLocation = async (data) => normalizeEntityResponse(await api.post("/locations", data))
export const updateLocation = async (id, data) => normalizeEntityResponse(await api.put(`/locations/${id}`, data))
export const deleteLocation = async (id) => api.delete(`/locations/${id}`)

export const getSuppliers = async (params = {}) => normalizeListResponse(await api.get("/suppliers", { params }))
export const createSupplier = async (data) => normalizeEntityResponse(await api.post("/suppliers", data))
export const updateSupplier = async (id, data) => normalizeEntityResponse(await api.put(`/suppliers/${id}`, data))
export const deleteSupplier = async (id) => api.delete(`/suppliers/${id}`)

export const getPurchaseHistories = async (params = {}) =>
    normalizeListResponse(await api.get("/purchase-histories", { params }))
export const createPurchaseHistory = async (data) =>
    normalizeEntityResponse(await api.post("/purchase-histories", data))
export const updatePurchaseHistory = async (id, data) =>
    normalizeEntityResponse(await api.put(`/purchase-histories/${id}`, data))
export const deletePurchaseHistory = async (id) => api.delete(`/purchase-histories/${id}`)

export const getUsers = async (params = {}) => normalizeListResponse(await api.get("/users", { params }))
export const createUser = async (data) => normalizeEntityResponse(await api.post("/users", data))
export const updateUser = async (id, data) => normalizeEntityResponse(await api.put(`/users/${id}`, data))
export const deleteUser = async (id) => api.delete(`/users/${id}`)
export const resetUserPassword = async (id, data = {}) =>
    normalizeEntityResponse(await api.post(`/users/${id}/reset-password`, data))

export const getRoles = async () => normalizeEntityResponse(await api.get("/roles"))
export const getRoleById = async (id) => normalizeEntityResponse(await api.get(`/roles/${id}`))
export const createRole = async (data) => normalizeEntityResponse(await api.post("/roles", data))
export const updateRole = async (id, data) => normalizeEntityResponse(await api.put(`/roles/${id}`, data))
export const deleteRole = async (id) => api.delete(`/roles/${id}`)
export const getPermissions = async () => normalizeEntityResponse(await api.get("/roles/permissions"))
export const updateRolePermissions = async (id, data) =>
    normalizeEntityResponse(await api.put(`/roles/${id}/permissions`, data))
