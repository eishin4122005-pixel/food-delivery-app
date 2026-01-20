"use client"

import {useEffect}from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";

export default function AdminDashboard() { 
const router = useRouter(); 
useEffect(() => { 
    const role = localStorage.getItem("role"); 
    const userId = localStorage.getItem("userId"); 
 
    if (!role || !userId || role !== "admin") { 
      router.replace("/login"); 
    } 
  }, [router]); 
 
  const handleLogout = () => { 
    localStorage.clear(); 
    document.cookie = "role=; max-age=0; path=/"; 
    document.cookie = "userId=; max-age=0; path=/"; 
    router.replace("/login"); 
  }; 
 
  return ( 
    <div className="min-h-screen bg-background"> 
      {/* Header */} 
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur"> 
        <div className="container mx-auto flex h-16 items-center justify-between px-4"> 
          <Link href="/" className="flex items-center gap-2"> 
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"> 
              <span className="text-xl font-bold text-primary-foreground">F</span> 
            </div> 
            <span className="text-xl font-bold text-foreground"> 
              FoodHub Admin 
            </span> 
          </Link> 
 
          <Button onClick={handleLogout} variant="destructive"> 
            Logout 
          </Button> 
        </div> 
      </header> 
 
      {/* Dashboard Main */} 
      <main className="flex flex-col items-center justify-center py-20 px-4"> 
        <Card className="w-full max-w-md text-center shadow-md"> 
          <CardHeader> 
            <CardTitle className="text-2xl font-bold"> 
              Welcome, Admin User 
            </CardTitle> 
          </CardHeader> 
 
          <CardContent className="space-y-4"> 
            {/* Manage Foods */} 
            <Link href="/admin/foods"> 
              <Button className="w-full">Manage Foods</Button> 
            </Link> 
 
            {/* Add New Food */} 
            <Link href="/admin/foods/add"> 
<Button variant="outline" className="w-full"> 
Add New Food 
</Button> 
</Link> 
{/* View Orders */} 
<Link href="/admin/orders"> 
<Button variant="secondary" className="w-full"> 
View All Orders 
</Button> 
</Link> 
</CardContent> 
</Card> 
</main> 
</div> 
); 
} 