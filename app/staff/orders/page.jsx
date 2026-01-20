"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
export default function StaffOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");
        if (!role || !userId || (role !== "staff" && role !== "admin")) {
            router.replace("/login");
            return;
        }
        fetchOrders(userId);
    }, [router]);
    const fetchOrders = async (userId) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://food-delivery-api-three.vercel.app/orders/user/${userId}`
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to load orders");

            setOrders(data);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Top Header Section */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">  My Orders</h1>
                <Link href="/staff">
                    <Button variant="outline">← Back</Button>
                </Link>
            </div>

            {/* Orders List */}
            {loading ? (
                <p className="text-center text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    You have no orders yet
                </p>
            ) : (
                <div className="grid gap-6 max-w-4xl mx-auto">
                    {orders.map((order) => (
                        <Card key={order._id}>
                            <CardHeader>
                                <CardTitle>Order #{order._id.slice(-6)}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p>
                                    <strong>Items:</strong> {order.items?.length || 0}
                                </p>
                                <ul className="list-disc list-inside">
                                    {order.items.map((it, i) => (
                                        <li key={i}>
                                            {it.food_id?.name || "Unknown Item"} × {it.quantity}
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    <strong>Total:</strong> ${order.totalPrice?.toFixed(2) || "0.00"}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className="capitalize">{order.status}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(order.createdAt || order.date).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 