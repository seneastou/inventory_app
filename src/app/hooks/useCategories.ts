"use client";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Récupérer la liste des catégories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/categories`);	
      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      toast.error("Impossible de récupérer les catégories");
      setError("Erreur lors de la récupération des catégories");
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une catégorie
  const addCategory = async (
    name: string
  ): Promise<{ id: number; name: string } | null> => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newCategory = await res.json();
        toast.success("Catégorie ajouté avec succès !");
        setCategories((prev) => [...prev, newCategory]);
        return newCategory; // Retourner la catégorie créée
      } else {
        setError("Erreur lors de l'ajout de la catégorie");
        
        return null;
      }
    } catch (err) {
      toast.error("Erreur lors de l'ajout de la catégorie");
      setError("Erreur lors de l'ajout de la catégorie");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Modifier une catégorie
  const updateCategory = async (id: number, name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success("Catégorie modifiée avec succès !");
        await fetchCategories(); // Recharger les catégories après modification
      } else {
        toast.error("Erreur lors de la modification de la catégorie");
        setError("Erreur lors de la modification de la catégorie");
      }
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Catégorie supprimée !");
        await fetchCategories(); // Recharger les catégories après suppression
      } else {
        toast.error("Erreur lors de la suppression de la catégorie");
        setError("Erreur lors de la suppression de la catégorie");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    loading,
    error,
  };
}
