import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-secondary/10 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">FoodHub</h1>
          <p className="text-muted-foreground">Restaurant Management System</p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/login" className="block">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/auth/register" className="block">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Register
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Manage your restaurant menu, orders, and operations seamlessly.
        </p>
      </div>
    </main>
  );
}
