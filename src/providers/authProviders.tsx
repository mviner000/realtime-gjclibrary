"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  useRouter,
  redirect,
  usePathname,
  useSearchParams,
} from "next/navigation";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { TOKEN_API_URL } from "@/constants";

const LOGIN_REDIRECT_URL = "/dashboard";
const LOGOUT_REDIRECT_URL = "/login";
const LOGIN_REQUIRED_URL = "/login";

const LOCAL_STORAGE_KEY = "is-logged-in";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: () => void;
  logout: () => void;

  loginRequiredRedirect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, error } = useSWR(TOKEN_API_URL, fetcher);

  useEffect(() => {
    if (data) {
      setIsAuthenticated(!!data?.token);
    }
  }, [data, setIsAuthenticated]);

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedAuthStatus) {
      const storedAuthStatusInt = parseInt(storedAuthStatus);
      setIsAuthenticated(storedAuthStatusInt === 1);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, "1");
    const nextUrl = searchParams.get("next");
    const invalidNextUrl = ["/login", "/logout"];
    const nextUrlValid =
      nextUrl && nextUrl.startsWith("/") && !invalidNextUrl.includes(nextUrl);
    if (nextUrlValid) {
      // router.replace(nextUrl);
      window.location.replace(nextUrl);
      return;
    } else {
      // router.replace(LOGIN_REDIRECT_URL);
      window.location.replace(LOGIN_REDIRECT_URL);
      return;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    // router.replace(LOGOUT_REDIRECT_URL);
    window.location.replace(LOGOUT_REDIRECT_URL);
  };

  const loginRequiredRedirect = () => {
    // user is not logged in via API
    setIsAuthenticated(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    let loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}`;
    if (loginWithNextUrl === pathname) {
      loginWithNextUrl = `${LOGIN_REQUIRED_URL}`;

    }
    window.location.replace(loginWithNextUrl);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        loginRequiredRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
