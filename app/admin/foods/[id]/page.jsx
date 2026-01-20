"use client";

 
import { useEffect, useState } from "react"; 
import { useParams, useRouter } from "next/navigation"; 
import Link from "next/link"; 
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { toast } from "sonner"; 
 
export default function EditFoodPage() { 
  const { id } = useParams(); 
  const router = useRouter(); 
  const [food, setFood] = useState({ name: "", description: "", price: "", image: "" }); 
 
  useEffect(() => { 
    fetchFood(); 
  }, []); 
 
  const fetchFood = async () => { 
    const res = await fetch(`https://food-delivery-api-three.vercel.app/foods/${id}`); 
    const data = await res.json(); 
    setFood(data); 
  }; 
 
  const handleChange = (e) => setFood({ ...food, [e.target.name]: e.target.value }); 
 
  const handleUpdate = async (e) => { 
    e.preventDefault(); 
    try { 
      const res = await fetch(`https://food-delivery-api-three.vercel.app/foods/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(food), 
      }); 
      if (res.ok) { 
        toast.success("Food updated!"); 
        router.push("/admin/foods"); 
      } else toast.error("Failed to update"); 
    } catch { 
      toast.error("Error updating food"); 
    } 
  }; 
 
  return ( 
    <div className="min-h-screen bg-background"> 
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0"> 
        <div className="container mx-auto flex h-16 items-center justify-between px-4"> 
          <Link href="/admin/foods"> 
            <Button variant="ghost">← Back</Button> 
          </Link> 
        </div> 
      </header>
          <main className="container mx-auto px-4 py-8"> 
        <Card className="max-w-lg mx-auto"> 
          <CardHeader> 
            <CardTitle className="text-2xl font-bold text-center">Edit Food</CardTitle> 
          </CardHeader> 
          <CardContent> 
            <form onSubmit={handleUpdate} className="space-y-4"> 
              <div> 
                <Label htmlFor="name">Name</Label> 
                <Input id="name" name="name" value={food.name} onChange={handleChange} required 
/> 
              </div> 
              <div> 
                <Label htmlFor="description">Description</Label> 
                <Input id="description" name="description" value={food.description} 
onChange={handleChange} /> 
              </div> 
              <div> 
                <Label htmlFor="price">Price</Label> 
                <Input id="price" name="price" type="number" value={food.price} 
onChange={handleChange} required /> 
              </div> 
              <div> 
                <Label htmlFor="image">Image URL</Label> 
                <Input id="image" name="image" value={food.image} onChange={handleChange} /> 
              </div> 
              <Button type="submit" className="w-full">Update Food</Button> 
            </form> 
          </CardContent> 
        </Card> 
      </main> 
    </div> 
  ); 
} 