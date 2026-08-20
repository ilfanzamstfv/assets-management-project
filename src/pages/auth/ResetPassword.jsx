import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { gooeyToast } from "@/components/ui/goey-toaster"

// API
import { resetPassword } from "@/services/auth"

export default function ResetPassword() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ""
    const code = location.state?.code || ""
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setForm({ ...form, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email || !code) {
            setError("Please verify your reset code first")
            return
        }

        if (form.password !== form.confirmPassword) {
            setError("Password confirmation does not match")
            return
        }

        setLoading(true)

        try {
            await resetPassword({
                email,
                resetCode: code,
                newPassword: form.password,
            })
            gooeyToast.success("Reset Password", {
                description: "Your password has been reset successfully.",
                preset: "smooth",
                showProgress: true,
            })
            navigate("/")
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-screen h-screen auth-grid-bg">
            <div className="flex justify-center items-center h-screen">
                <Card className="w-full max-w-sm mx-4 shadow-lg">
                    <CardHeader className="flex flex-row gap-3">
                        <div className="flex flex-col gap-2">
                            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                            <CardDescription className="text-sm">
                                Please enter your new password
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="grid gap-2">
                                    <Label htmlFor="password">New Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your new password"
                                        value={form.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate("/forgot-password")}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
