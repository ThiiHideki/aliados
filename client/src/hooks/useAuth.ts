import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

const TOKEN_KEY = "aliados_session_token";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  // Check URL query parameters for token after OAuth redirect
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");
  if (urlToken) {
    try {
      localStorage.setItem(TOKEN_KEY, urlToken);
      // Clean query parameter from address bar
      params.delete("token");
      params.delete("login");
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    } catch {
      // Ignore localStorage errors
    }
    return urlToken;
  }

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

async function fetchUser(): Promise<User | null> {
  const token = getStoredToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch("/api/auth/user", {
    credentials: "include",
    headers,
  });

  if (response.status === 401) {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    user: user ?? undefined,
    isLoading,
    isAuthenticated: !!user,
    isError,
  };
}
