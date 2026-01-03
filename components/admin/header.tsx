import Link from "next/link";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = ({ userName }: { userName: string }) => {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-8">
          <Link
            href="/admin/dashboard"
            className="text-xl font-bold text-primary"
          >
            FoodHub Admin
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/categories"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Menu
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Orders
            </Link>
            <Link
              href="/admin/items"
              className="text-sm text-foreground hover:text-primary transition"
            >
              Items
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>{userName}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Welcome, {userName}
                  <DropdownMenuShortcut></DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Header;
