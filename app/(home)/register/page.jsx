"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch("https://food-delivery-api-three.vercel.app/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, role: "staff" }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            setSuccess("Registration successful! Redirecting to login...");
            setForm({ username: "", email: "", password: "" });
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-87.5">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <Label>Username</Label>
                            <Input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-600 text-sm">{success}</p>}
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                    <p className="mt-4 text-sm text-center">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 