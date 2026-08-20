import { useContext } from "react"

import AssetContext from "@/context/asset-context"

export function useAsset() {
    const context = useContext(AssetContext)
    if (!context) {
        throw new Error("useAsset must be used within an AssetProvider")
    }
    return context
}
