"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user?.id || user.role !== "ADMIN") {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Checking access…</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return null; // prevent flash
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your restaurant management panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Menu Categories</h3>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove categories from your restaurant
          </p>
          <Link href="/admin/categories" className="block">
            <Button className="w-full">Manage Categories</Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Orders</h3>
          <p className="text-sm text-muted-foreground">
            View and manage customer orders in real-time
          </p>
          <Link href="/admin/orders" className="block">
            <Button className="w-full">View Orders</Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Manage items</h3>
          <p className="text-sm text-muted-foreground">Organize your menu with in categories</p>
          <Link href="/admin/items" className="block">
            <Button className="w-full">Manage items in categories</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
