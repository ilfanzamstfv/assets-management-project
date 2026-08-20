import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { fetchUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)
      fetchUser().then(() => navigate("/home"))
    } else {
      navigate("/")
    }
  }, [navigate, searchParams, fetchUser])

  return <div className="flex items-center justify-center h-screen">Loading...</div>
}
