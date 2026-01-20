"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");

        if (!role || !userId || role !== "admin") {
            router.replace("/login");
        }
    }, [router]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("https://food-delivery-api-three.vercel.app/orders");
                const data = await res.json();

                if (Array.isArray(data)) setOrders(data);
                else toast.error("Failed to load orders");
            } catch (err) {
                toast.error("Error fetching orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(
                `https://food-delivery-api-three.vercel.app/orders/${id}/status`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            const data = await res.json();
            if (res.ok) {
                toast.success("Order status updated");
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === id ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                toast.error(data.error || "Failed to update order");
            }
        } catch (err) {
            toast.error("Error updating order");
        }
    };

    if (loading)
        return (
            <p className="text-center py-10 text-muted-foreground">
                Loading orders...
            </p>
        );

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">All Staff Orders</h1>
                <Link href="/admin">
                    <Button variant="outline">← Back</Button>
                </Link>
            </div>

            <Card className="mx-auto max-w-5xl">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-center">
                        Manage Orders
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {orders.length === 0 ? (
                        <p className="text-center text-muted-foreground">No orders found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-muted text-left">
                                        <th className="p-2 border">Order ID</th>
                                        <th className="p-2 border">Items</th>
                                        <th className="p-2 border">Total</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-t hover:bg-muted/50">
                                            <td className="p-2 border">{order.orderId}</td>
                                            <td className="p-2 border">
                                                {order.items.map((it, i) => (
                                                    <div key={i}>
                                                        {it.food_id?.name || "Unknown"} × {it.quantity}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="p-2 border">${order.totalPrice?.toFixed(2)}</td>
                                            <td className="p-2 border capitalize">{order.status}</td>
                                            <td className="p-2 border text-center">
                                                <Select
                                                    onValueChange={(val) => updateStatus(order._id, val)}
                                                    defaultValue={order.status}
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 
