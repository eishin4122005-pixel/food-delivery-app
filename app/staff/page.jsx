"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
export default function StaffPage() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    if (!role || !userId || (role !== "staff" && role !== "admin")) {
      router.replace("/login");
      return;
    }
    fetchFoods();
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, [router]);

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://food-delivery-api-three.vercel.app/foods");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to fetch foods: ${res.status}`);
      }
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error("Fetch foods error:", error);
      toast.error("Failed to load foods: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    toast.success("Logged out successfully");
    router.replace("/login");
  };


  const handleAddToCart = (food) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = existingCart.findIndex((item) => item._id === food._id);

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({ ...food, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setCart([...existingCart]);
    toast.success(`${food.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">FoodHub</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative bg-transparent"
              onClick={() => router.push("/staff/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
            <Link href="/staff/orders">
              <Button variant="outline">My Orders</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-10 text-center text-foreground">
          Available Foods
        </h2>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading foods...</p>
        ) : foods.length === 0 ? (
          <p className="text-center text-muted-foreground">No foods available</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {foods.map((food) => (
              <Card
                key={food._id}
                className="rounded-2xl shadow-md hover:shadow-lg overflow-hidden transition-all"
              >
                <div className="relative">
                  {food.image ? (
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-primary/5 text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <CardContent className="flex flex-col justify-between p-5">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{food.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {food.description || "No description available"}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-col items-start">
                    <span className="text-lg font-bold text-primary">
                      ${food.price?.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(food)}
                      className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground-rounded-lg"
                    >
                      + Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
