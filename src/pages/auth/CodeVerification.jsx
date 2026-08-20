import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import { gooeyToast } from "@/components/ui/goey-toaster"

import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// API
import { verifyCode } from "@/services/auth"

export default function CodeVerification() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ""
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!email) {
            setError("Please request a reset code first")
            return
        }

        if (code.length !== 6) {
            setError("Verification code must be 6 digits")
            return
        }

        setLoading(true)

        try {
            await verifyCode({ email, code })
            gooeyToast.success("Code Verified", {
                description: "Please create your new password.",
                preset: "smooth",
                showProgress: true,
            })
            navigate("/reset-password", { state: { email, code } })
        } catch (err) {
            setError(err.response?.data?.message || "Invalid verification code")
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
                            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                            <CardDescription className="text-sm">
                                Enter the 6 digit verification code sent to your email address
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="flex items-center justify-center">
                                    <InputOTP
                                        id="digits-only"
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        value={code}
                                        onChange={setCode}
                                        disabled={loading}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Send"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate("/forgot-password")}
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
