import { Navigate, useLocation } from "react-router-dom"

import { useAsset } from "@/hooks/useAsset"

export default function ModuleGuard({ moduleId, children }) {
    const location = useLocation()
    const { modulePermissions, accessibleModules, currentRole } = useAsset()

    const hasAccess =
        moduleId === "master-data"
            ? currentRole?.toLowerCase() === "admin"
            : moduleId === "users"
            ? Boolean(modulePermissions.users.manage || modulePermissions.users.roleManage)
            : Boolean(modulePermissions[moduleId]?.read)

    if (!hasAccess) {
        return <Navigate to={accessibleModules[0]?.path || "/home"} replace state={{ from: location }} />
    }

    return children
}
