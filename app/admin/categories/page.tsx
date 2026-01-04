"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authenticatedFetch } from "@/lib/auth";
import type { MenuItem } from "@/types/menu";
import { Spinner } from "@/components/ui/spinner";
import { Item } from "@/components/ui/item";

async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "menu_uploads");
  formData.append("folder", "menu");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.secure_url as string;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch("/api/v1/menu");
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await authenticatedFetch(`/api/v1/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      setItems(items.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async () => {
    if (!categoryName) return;

    try {
      let imageUrl: string | undefined;

      if (categoryImage) {
        imageUrl = await uploadToCloudinary(categoryImage);
      }

      const res = await authenticatedFetch("/api/v1/menu/categories", {
        method: "POST",
        body: JSON.stringify({
          name: categoryName,
          imageUrl,
          order: 1,
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Category created" });
      setCategoryName("");
      setCategoryImage(null);
      fetchMenuItems();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Categories</h1>
          <p className="text-muted-foreground mt-2">Manage your restaurant's menu</p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create Category</h2>

        <input
          className="w-full border rounded p-2"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCategoryImage(e.target.files?.[0] || null)}
        />

        <Button type="submit" onClick={handleCreateCategory}>
          Create Category
        </Button>
      </Card>

      {loading ? (
        <Item variant="muted" className="justify-center items-center py-10">
          <Spinner />
        </Item>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No menu items yet. Start by adding one!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="p-4 space-y-4">
              {item.image && (
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Category- {item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary">
                    {item.items.length > 0 ? `${item.items.length} ${item.name}` : "N/A"}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.category}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
