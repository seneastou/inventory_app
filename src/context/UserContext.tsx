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
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Hook personnalisé pour utiliser le contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider pour fournir le contexte utilisateur à l'application
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Charger l'utilisateur depuis l'API au montage du composant
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`); // Assurez-vous que cette route existe
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Mettre à jour l'utilisateur dans l'état
        } else {
          setUser(null); // Aucun utilisateur connecté
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setUser(null); // Mettre à jour l'état en cas d'erreur
      }
    };

    fetchCurrentUser(); // Appel au backend pour récupérer l'utilisateur
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
