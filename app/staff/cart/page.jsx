"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
export default function StaffCartPage() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");
        if (!role || !userId || (role !== "staff" && role !== "admin")) {
            router.replace("/login");
            return;
        }
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, [router]);
    const handleQuantityChange = (foodId, delta) => {
        const updatedCart = cart.map((item) =>
            item._id === foodId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };
    const handleRemoveItem = (foodId) => {
        const updatedCart = cart.filter((item) => item._id !== foodId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setLoading(true);
        const userId = localStorage.getItem("userId");

        try {
            const res = await fetch(
                "https://food-delivery-api-three.vercel.app/orders",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        user_id: userId,
                        items: cart.map((item) => ({
                            food_id: item._id,
                            quantity: item.quantity,
                        })),
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to place order");

            setCart([]);
            localStorage.removeItem("cart");
            toast.success("Order placed successfully!");
            router.push("/staff/orders");
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-background p-6">
            {/* Header */}
            <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold"> Your Cart</h1>
                <Link href="/staff">
                    <Button variant="outline">← Back</Button>
                </Link>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    Your cart is empty
                </p>
            ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {cart.map((item) => (
                        <Card
                            key={item._id}
                            className="flex justify-between items-center p-4"
                        >
                            <div>
                                <h2 className="font-bold text-lg">{item.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    ${item.price?.toFixed(2)}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Button
                                        onClick={() => handleQuantityChange(item._id, -1)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        -
                                    </Button>
                                    <span className="font-semibold">{item.quantity}</span>
                                    <Button
                                        onClick={() => handleQuantityChange(item._id, 1)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        +
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="ml-4"
                                        size="sm"
                                        onClick={() => handleRemoveItem(item._id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                            <span className="font-bold text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </Card>
                    ))}

                    {/* Checkout Section */}
                    <div className="flex justify-between items-center mt-6 border-t pt-4">
                        <h2 className="text-xl font-bold">
                            Total: ${totalPrice.toFixed(2)}
                        </h2>
                        <Button onClick={handleCheckout} disabled={loading}>
                            {loading ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}