import { Navigate, useLocation } from "react-router-dom"

import { useAsset } from "@/hooks/useAsset"

const MASTER_TYPE_MAP = {
    category: "categories",
    location: "locations",
    supplier: "suppliers",
}

export default function ModuleGuard({ moduleId, type, children }) {
    const location = useLocation()
    const { modulePermissions, accessibleModules } = useAsset()

    const hasAccess =
        moduleId === "master-data"
            ? type
                ? Boolean(modulePermissions[MASTER_TYPE_MAP[type]]?.read)
                : ["categories", "locations", "suppliers"].some((key) => modulePermissions[key]?.read)
            : moduleId === "users"
            ? Boolean(modulePermissions.users.manage || modulePermissions.users.roleManage)
            : Boolean(modulePermissions[moduleId]?.read)

    if (!hasAccess) {
        return <Navigate to={accessibleModules[0]?.path || "/home"} replace state={{ from: location }} />
    }

    return children
}
