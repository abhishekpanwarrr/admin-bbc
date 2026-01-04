"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, getToken } from "@/lib/auth";

type User = {
  id: string;
  email: string;
  name?: string;
  role: "ADMIN" | "USER";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  /**
   * 🔐 Initial auth check (reuses your logic)
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * 🚦 Central route guard
   */
  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in → protect private routes
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    // ✅ Logged in → block login page
    if (isAuthenticated && pathname === "/login") {
      if (user?.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/user/menu");
      }
      return;
    }

    // 🛑 Role protection
    if (user?.role === "ADMIN" && pathname.startsWith("/user")) {
      router.replace("/admin/dashboard");
    }

    if (user?.role === "USER" && pathname.startsWith("/admin")) {
      router.replace("/user/menu");
    }
  }, [isAuthenticated, user, loading, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
