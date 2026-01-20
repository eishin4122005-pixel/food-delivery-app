"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");

        if (role && userId) {
            if (role === "admin") router.replace("/admin");
            else router.replace("/staff");
            return;
        }
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        const rememberedPassword = localStorage.getItem("rememberedPassword");
        const rememberFlag = localStorage.getItem("rememberMe");

        if (rememberFlag === "true" && rememberedEmail && rememberedPassword) {
            setEmail(rememberedEmail);
            setPassword(rememberedPassword);
            setRememberMe(true);
        }
        setLoading(false);
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("https://food-delivery-api-three.vercel.app/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Invalid email or password");

            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.id);
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberedPassword", password);
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
            }
            if (data.role === "admin") router.replace("/admin");
            else router.replace("/staff");
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-87.5">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="cursor-pointer"
                            />
                            <Label htmlFor="rememberMe" className="cursor-pointer">Remember Me</Label>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                    <p className="mt-4 text-sm text-center">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}