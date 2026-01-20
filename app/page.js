"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { CartBadge } from "@/components/cart-badge"

 export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/*Header*/}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-xl font-bold text-foreground">FoodHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <CartBadge />

            {/* Conditionally clickable cart button */}
            {isLoggedIn ? (
              <Link href="/cart">
                <Button variant="outline" size="icon" className="relative bg-transparent">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="relative bg-transparent cursor-not-allowed opacity-50"
                title="Login to access cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/*Hero Section*/}
      <section className="border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
            Delicious Food, Delivered Fast
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Order from our curated menu of fresh, high-quality meals prepared by expert chefs.
          </p>
          <Link href="/login">
            <Button size="lg">Login to Order</Button>
          </Link>
        </div>
      </section>
    </div>
  );
} 