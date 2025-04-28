"use client";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/users`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        setError("La réponse de l'API des utilisateurs n'est pas un tableau");
        return;
      }
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
    console.log("Données envoyées à l'API /users :", user); 
    try {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      
      if (res.ok) {
        const createdUser = await res.json(); // Récupérer l'utilisateur créé à partir de la réponse
        setUsers([...users, createdUser]); // Ajouter l'utilisateur à la liste des utilisateurs
        toast.success("Utilisateur ajouté avec succès !");
        return createdUser;
      } else {
        setError("Erreur lors de l'ajout de l'utilisateur");
        toast.error("Impossible d'ajouter l'utilisateur.");
        return null;
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de l'utilisateur");
      toast.error("Erreur serveur.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Modifier un utilisateur
  const updateUser = async (user: User) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: user.role }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === user.id ? user : u)));
        toast.success("Utilisateur modifié avec succès !");
      } else {
        setError("Erreur lors de la modification de l'utilisateur");
      }
    } catch (err) {
      setError("Erreur lors de la modification de l'utilisateur");
      toast.error("Impossible de modifier l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
        toast.success("Utilisateur supprimé avec succès !");
      } else {
        setError("Erreur lors de la suppression de l'utilisateur");
      }
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur");
      toast.error("Impossible de supprimer l'utilisateur.");
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
