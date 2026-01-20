"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead,TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function FoodListPage() {
  const router = useRouter();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);
  const fetchFoods = async () => {
    try {
      const res = await fetch("https://food-delivery-api-three.vercel.app/foods");
      const data = await res.json();
      setFoods(data);
    } catch {
      toast.error("Failed to fetch foods");
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this foods?"))
      return;
    try {
      const res = await fetch(`https://food-delivery-api-three.vercel.app/foods/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Food deleted");
        fetchFoods();
      } else toast.error("Failed to delete");
    } catch {
      toast.error("Error deleting food");
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/admin">
            <Button variant="ghost">← Dashboard</Button>
          </Link>
          <Link href="/admin/foods/add">
            <Button>Add New Food</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Food List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foods.map((food) => (
                  <TableRow key={food._id}>
                    <TableCell>{food.foodId}</TableCell>
                    <TableCell>{food.name}</TableCell>
                    <TableCell>${food.price}</TableCell>
                    <TableCell>
                      {food.image ? (
                        <img src={food.image} alt={food.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Link href={`/admin/foods/${food._id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(food._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

