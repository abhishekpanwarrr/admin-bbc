"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Item } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { authenticatedFetch } from "@/lib/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
};

type Category = {
  id: string;
  name: string;
  imageUrl: string;
  items: MenuItem[];
};

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

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const router = useRouter();
  const { loading: userLoading, user } = useAuth();
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await authenticatedFetch("/api/v1/menu/");
      const data = await res.json();
      setCategories(data);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateMenuItem = async () => {
    if (!itemName || !itemPrice || !itemCategoryId) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setItemLoading(true);
      let imageUrl: string | undefined;

      if (itemImage) {
        imageUrl = await uploadToCloudinary(itemImage);
      }

      const res = await authenticatedFetch("/api/v1/menu/items", {
        method: "POST",
        body: JSON.stringify({
          name: itemName,
          description: itemDescription || undefined,
          price: Number(itemPrice),
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
      setOpen(false);

      fetchCategories();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create menu item",
        variant: "destructive",
      });
      setItemLoading(false);
    } finally {
      setItemLoading(false);
    }
  };

  useEffect(() => {
    if (userLoading) return;

    if (!user?.id || user.role !== "ADMIN") {
      router.replace("/auth/login");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return <div>Checking access…</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return null; // prevent flash
  }
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurant menu</p>
        </div>

        {/* Dialog Trigger */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Menu Item</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Menu Item</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Textarea
                placeholder="Description (optional)"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
              <Input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Price in paise (15000 = ₹150)"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
              <Select value={itemCategoryId} onValueChange={(value) => setItemCategoryId(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => setItemImage(e.target.files?.[0] || null)}
              />
              <Button
                disabled={itemLoading}
                className="w-full mt-2"
                onClick={handleCreateMenuItem}
                type="submit"
              >
                {itemLoading ? <Spinner /> : "Create Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories */}
      <div className="space-y-10">
        {loading ? (
          <Item variant="muted" className="justify-center items-center py-10">
            <Spinner />
          </Item>
        ) : categories.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No menu items yet. Start by adding one!</p>
          </Card>
        ) : (
          categories.map((category) => (
            <section key={category.id}>
              <h2 className="text-xl font-semibold mb-3">{category.name}</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {category.items?.map((item) => (
                  <Card key={item.id} className="p-3 space-y-2 hover:shadow-md transition">
                    <div className="relative w-full h-28 rounded overflow-hidden">
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="text-sm font-semibold truncate">{item.name}</div>

                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </div>

                    <div className="text-sm font-bold">₹{item.price / 100}</div>

                    {!item.isAvailable && (
                      <span className="text-xs text-red-500">Not Available</span>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
