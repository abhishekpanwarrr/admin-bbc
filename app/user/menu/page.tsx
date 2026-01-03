"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authenticatedFetch } from "@/lib/auth";

// --------------------
// Cloudinary uploader
// --------------------
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

type Category = {
  id: string;
  name: string;
};

export default function MenuAdminPage() {
  const { toast } = useToast();

  // --------------------
  // Categories
  // --------------------
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  // --------------------
  // Menu Item
  // --------------------
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);

  // --------------------
  // Fetch categories
  // --------------------
  const fetchCategories = async () => {
    const res = await authenticatedFetch("/api/v1/menu/");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --------------------
  // Create Category
  // --------------------
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
      fetchCategories();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  // --------------------
  // Create Menu Item
  // --------------------
  const handleCreateMenuItem = async () => {
    if (!itemName || !itemPrice || !itemCategoryId) return;

    try {
      let imageUrl: string | undefined;

      if (itemImage) {
        imageUrl = await uploadToCloudinary(itemImage);
      }

      const res = await authenticatedFetch("/api/v1/menu/items", {
        method: "POST",
        body: JSON.stringify({
          name: itemName,
          description: itemDescription || undefined,
          price: Number(itemPrice), // 💡 paise
          categoryId: itemCategoryId,
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error();

      toast({ title: "Menu item created" });
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemCategoryId("");
      setItemImage(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Menu Management</h1>

      <div className="flex gap-10 shadow shadow-card">
        {/* ===================== */}
        {/* CREATE CATEGORY */}
        {/* ===================== */}
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
        {/* ===================== */}
        {/* CREATE MENU ITEM */}
        {/* ===================== */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Menu Item</h2>

          <input
            className="w-full border rounded p-2"
            placeholder="Item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <textarea
            className="w-full border rounded p-2"
            placeholder="Description (optional)"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
          />

          <input
            className="w-full border rounded p-2"
            type="number"
            placeholder="Price in paise (e.g. 15000 = ₹150)"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />

          <select
            className="w-full border rounded p-2"
            value={itemCategoryId}
            onChange={(e) => setItemCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setItemImage(e.target.files?.[0] || null)}
          />

          <Button onClick={handleCreateMenuItem}>Create Menu Item</Button>
        </Card>
      </div>
    </div>
  );
}
