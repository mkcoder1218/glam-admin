import { api } from "@/lib/api";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phone: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("auth") === "true";
  });

const login = async (phone: string, password: string): Promise<boolean> => {
  try {
    const res = await api.auth.create({ phone_number: phone, password: password } as any);
    console.log(res)
    if((res as any)?.user?.role?.name==='Admin'||(res as any)?.user?.role?.name==='Super Admin'||(res as any)?.user?.role?.name==='SuperAdmin'){
    if ((res as any)?.token) {
      setIsAuthenticated(true);
      localStorage.setItem("auth", "true");
      localStorage.setItem("token", (res as any).token);
      return true;
    }
}
    return false;
  } catch (err) {
    console.error("Login failed:", err);
    return false;
  }
};


  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
