const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_STORAGE_KEY = "auth_token";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
    name?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role: "USER" | "ADMIN";
}

// Store token in browser
export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    // Also set in cookie if possible (via a route handler)
    fetch("/api/auth/set-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {
      // Silently fail - localStorage is the primary storage
    });
  }
};

// Get token from browser
export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
};

// Remove token from browser
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    // Also clear from cookies
    fetch("/api/auth/clear-token", {
      method: "POST",
    }).catch(() => {
      // Silently fail
    });
  }
};

// API call with authentication
export const authenticatedFetch = (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// Login API call
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  setToken(data.token);
  return data;
};

// Register API call
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const data = await response.json();
  setToken(data.token);
  return data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await authenticatedFetch("/api/v1/auth/me");

  if (!response.ok) {
    removeToken();
    throw new Error("Failed to get user");
  }

  return response.json();
};
