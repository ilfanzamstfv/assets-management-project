import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { gooeyToast } from "@/components/ui/goey-toaster"

// API
import { forgotPassword } from "@/services/auth"

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await forgotPassword({ email })
            gooeyToast.success("Forgot Password", {
                description: "Verification code has been sent to your email.",
                preset: "smooth",
                showProgress: true,
            })
            navigate("/code-verification", { state: { email } })
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset password email")
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
                            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
                            <CardDescription className="text-sm">
                                Don't worry! Please enter email address associated. <br />
                                We will send you a link to reset your password.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Sending..." : "Send"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate("/")}
                                        disabled={loading}
                                    >
                                        Back
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
