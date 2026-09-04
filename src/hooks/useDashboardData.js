import { useCallback, useEffect, useState } from "react"

import { buildPurchaseTrend } from "@/lib/assetUtils"
import { getPurchaseHistories, getStockItems } from "@/services/assets"

const DAY_MS = 24 * 60 * 60 * 1000
const MAX_RECORDS = 100
const MIN_WINDOW_DAYS = 14

const initialLoading = { trend: true, lowestStock: true }
const initialErrors = { trend: null, lowestStock: null }

function toIsoDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export function useDashboardData() {
    const [trend, setTrend] = useState([])
    const [trendWindow, setTrendWindow] = useState(30)
    const [lowestStock, setLowestStock] = useState([])
    const [loading, setLoading] = useState(initialLoading)
    const [errors, setErrors] = useState(initialErrors)

    const fetchTrend = useCallback(async (days = 30) => {
        setLoading((current) => ({ ...current, trend: true }))
        setErrors((current) => ({ ...current, trend: null }))

        try {
            const endDate = toIsoDate(new Date())
            const startDate = toIsoDate(new Date(Date.now() - (days - 1) * DAY_MS))
            const { data, meta } = await getPurchaseHistories({
                startDate,
                endDate,
                page: 1,
                limit: MAX_RECORDS,
            })

            if (meta?.total > data.length && days > MIN_WINDOW_DAYS) {
                return fetchTrend(MIN_WINDOW_DAYS)
            }

            setTrend(buildPurchaseTrend(data, days))
            setTrendWindow(days)
        } catch (error) {
            setErrors((current) => ({
                ...current,
                trend: error.response?.data?.message || "Gagal memuat tren pembelian.",
            }))
        } finally {
            setLoading((current) => ({ ...current, trend: false }))
        }
    }, [])

    const fetchLowestStock = useCallback(async () => {
        setLoading((current) => ({ ...current, lowestStock: true }))
        setErrors((current) => ({ ...current, lowestStock: null }))

        try {
            const { data } = await getStockItems({
                sort: "lowest-stock",
                page: 1,
                limit: 8,
            })
            setLowestStock(data)
        } catch (error) {
            setErrors((current) => ({
                ...current,
                lowestStock: error.response?.data?.message || "Gagal memuat data stok.",
            }))
        } finally {
            setLoading((current) => ({ ...current, lowestStock: false }))
        }
    }, [])

    const retry = useCallback(() => {
        fetchTrend(30)
        fetchLowestStock()
    }, [fetchTrend, fetchLowestStock])

    useEffect(() => {
        fetchTrend(30)
        fetchLowestStock()
    }, [fetchTrend, fetchLowestStock])

    return { trend, trendWindow, lowestStock, loading, errors, retry }
}

export default useDashboardData
