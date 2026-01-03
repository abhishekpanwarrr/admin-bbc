// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"
// import { authenticatedFetch } from "@/lib/auth"
// import type { MenuItem } from "@/types/menu"

// export default function UserMenuPage() {
//   const [items, setItems] = useState<MenuItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [categories, setCategories] = useState<string[]>([])
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
//   const [cart, setCart] = useState<(MenuItem & { quantity: number })[]>([])
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchMenuItems()
//     fetchCategories()
//   }, [])

//   const fetchMenuItems = async () => {
//     try {
//       setLoading(true)
//       const response = await authenticatedFetch("/api/v1/menu")
//       if (!response.ok) throw new Error("Failed to fetch menu items")
//       const data = await response.json()
//       setItems(data)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load menu items",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCategories = async () => {
//     try {
//       const response = await authenticatedFetch("/api/v1/menu/categories")
//       if (!response.ok) throw new Error("Failed to fetch categories")
//       const data = await response.json()
//       setCategories(data.map((cat: any) => cat.name || cat))
//     } catch (error) {
//       console.error("Failed to load categories")
//     }
//   }

//   const handleAddToCart = (item: MenuItem) => {
//     const existingItem = cart.find((cartItem) => cartItem.id === item.id)
//     if (existingItem) {
//       setCart(
//         cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
//       )
//     } else {
//       setCart([...cart, { ...item, quantity: 1 }])
//     }
//     toast({
//       title: "Added to cart",
//       description: `${item.name} added to your cart`,
//     })
//   }

//   const handleRemoveFromCart = (itemId: string) => {
//     setCart(cart.filter((item) => item.id !== itemId))
//   }

//   const handleUpdateQuantity = (itemId: string, quantity: number) => {
//     if (quantity <= 0) {
//       handleRemoveFromCart(itemId)
//     } else {
//       setCart(cart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
//     }
//   }

//   const handlePlaceOrder = async () => {
//     if (cart.length === 0) {
//       toast({
//         title: "Error",
//         description: "Your cart is empty",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

//       const response = await authenticatedFetch("/api/v1/orders", {
//         method: "POST",
//         body: JSON.stringify({
//           items: cart.map((item) => ({
//             menuItemId: item.id,
//             quantity: item.quantity,
//             price: item.price,
//           })),
//           totalPrice,
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to place order")

//       toast({
//         title: "Success",
//         description: "Order placed successfully!",
//       })

//       setCart([])
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to place order",
//         variant: "destructive",
//       })
//     }
//   }

//   const filteredItems = selectedCategory ? items.filter((item) => item.category === selectedCategory) : items
//   const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Menu</h1>
//         <p className="text-muted-foreground mt-2">Browse and order from our menu</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         <div className="lg:col-span-3 space-y-4">
//           {/* Category Filter */}
//           <div className="flex flex-wrap gap-2">
//             <Button
//               variant={selectedCategory === null ? "default" : "outline"}
//               onClick={() => setSelectedCategory(null)}
//               size="sm"
//             >
//               All
//             </Button>
//             {categories.map((category) => (
//               <Button
//                 key={category}
//                 variant={selectedCategory === category ? "default" : "outline"}
//                 onClick={() => setSelectedCategory(category)}
//                 size="sm"
//               >
//                 {category}
//               </Button>
//             ))}
//           </div>

//           {/* Menu Items */}
//           {loading ? (
//             <p className="text-muted-foreground text-center py-8">Loading menu...</p>
//           ) : filteredItems.length === 0 ? (
//             <Card className="p-8 text-center">
//               <p className="text-muted-foreground">No items in this category</p>
//             </Card>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {filteredItems.map((item) => (
//                 <Card key={item.id} className="p-4 space-y-4 hover:shadow-lg transition">
//                   {item.image && (
//                     <img
//                       src={item.image || "/placeholder.svg"}
//                       alt={item.name}
//                       className="w-full h-40 object-cover rounded-md"
//                     />
//                   )}
//                   <div className="space-y-2">
//                     <h3 className="font-semibold text-foreground">{item.name}</h3>
//                     <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
//                     <div className="flex justify-between items-center pt-2 border-t border-border">
//                       <span className="text-lg font-bold text-primary">${item.price}</span>
//                       <Button size="sm" onClick={() => handleAddToCart(item)}>
//                         Add
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Cart Sidebar */}
//         <div className="lg:col-span-1">
//           <Card className="p-6 space-y-4 sticky top-24">
//             <h2 className="text-xl font-bold text-foreground">Cart</h2>

//             {cart.length === 0 ? (
//               <p className="text-sm text-muted-foreground text-center py-4">Your cart is empty</p>
//             ) : (
//               <>
//                 <div className="space-y-3 max-h-64 overflow-y-auto">
//                   {cart.map((item) => (
//                     <div key={item.id} className="flex items-start justify-between gap-2 text-sm">
//                       <div className="flex-1">
//                         <p className="font-medium text-foreground">{item.name}</p>
//                         <p className="text-xs text-muted-foreground">${item.price}</p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
//                           className="px-2 py-1 bg-input rounded text-foreground hover:bg-card"
//                         >
//                           -
//                         </button>
//                         <span className="w-6 text-center text-foreground">{item.quantity}</span>
//                         <button
//                           onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
//                           className="px-2 py-1 bg-input rounded text-foreground hover:bg-card"
//                         >
//                           +
//                         </button>
//                         <button
//                           onClick={() => handleRemoveFromCart(item.id)}
//                           className="px-2 py-1 text-destructive text-xs hover:bg-destructive/10 rounded"
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border-t border-border pt-3 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-foreground">Total:</span>
//                     <span className="text-xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
//                   </div>
//                   <Button className="w-full" onClick={handlePlaceOrder}>
//                     Place Order
//                   </Button>
//                 </div>
//               </>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

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
  );
}
