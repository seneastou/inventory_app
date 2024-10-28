"use client";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      console.log("Utilisateurs récupérés :", data);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un utilisateur
  const addUser = async (user: Omit<User, "id">) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      
      if (res.ok) {
        const createdUser = await res.json(); // Récupérer l'utilisateur créé à partir de la réponse
        setUsers([...users, createdUser]); // Ajouter l'utilisateur à la liste des utilisateurs
        return createdUser;
      } else {
        setError("Erreur lors de l'ajout de l'utilisateur");
        return null;
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de l'utilisateur");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Modifier un utilisateur
  const updateUser = async (user: User) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === user.id ? user : u)));
      } else {
        setError("Erreur lors de la modification de l'utilisateur");
      }
    } catch (err) {
      setError("Erreur lors de la modification de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        setError("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    fetchUsers,
    loading,
    error,
  };
}
