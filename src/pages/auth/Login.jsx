import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "@/services/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import googleIcon from "@/assets/icons/googleIcons.svg"
import githubIcon from "@/assets/icons/githubIcons.svg"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { gooeyToast } from "@/components/ui/goey-toaster"
import { useAuth } from "@/hooks/useAuth"
import { FingerprintPattern } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await login(form)
      const token = res.data.token || res.data.data?.token
      localStorage.setItem("token", token)
      await fetchUser()
      gooeyToast.success('Login', {
        description: 'You have been logged in successfully.',
        preset: 'smooth',
        showProgress: true,
      })
      navigate("/home")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-linear-to-r from-slate-900 to-zinc-800">
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm mx-4">
          <CardHeader className="flex flex-row gap-3">
            <FingerprintPattern className="w-12 h-12 border-2 rounded-md p-1.5 border-black hover:text-gray-500 hover:border-gray-500" />
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
              <CardDescription className="text-sm">Don't have an account? <Link to="/signup" className="underline hover:text-black font-medium">Sign up</Link></CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="space-y-4">
              <div className="flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
              }
            >
              Login with Google <img src={googleIcon} alt="Google" className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`
              }
            >
              Login with Github <img src={githubIcon} alt="Github" className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
