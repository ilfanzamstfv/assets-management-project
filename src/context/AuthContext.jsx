import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/auth"
import AuthContext from "@/context/auth-context"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setUser(null)
            setLoading(false)
            return
        }
        try {
            const res = await getCurrentUser()
            setUser(res.data?.data || res.data)
        } catch {
            localStorage.removeItem("token")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    useEffect(() => {
        const run = async () => {
            await fetchUser()
        }

        run()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
