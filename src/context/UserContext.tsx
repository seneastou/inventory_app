"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  companyId?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loadingUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData?.isActive) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // ✅ 1. Charger depuis localStorage si possible
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoadingUser(false);
    } else {
      fetchCurrentUser();
    }
  }, []);

  // ✅ 2. Mettre à jour le stockage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
export { UserContext };

