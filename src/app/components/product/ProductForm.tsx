"use client";
import { useState, useEffect } from "react";
import { Product } from "./ProductCard";
import { useUsers } from "../../hooks/useUsers";
import { useUser } from "../../../context/UserContext"; // Assurez-vous que ce contexte utilisateur est bien configuré

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id" | "createdat">) => void; // userId sera ajouté automatiquement
  categories: { id: number; name: string }[];
  addCategory: (name: string) => Promise<{ id: number; name: string } | null>;
}

export default function ProductForm({
  onSubmit,
  categories,
  addCategory,
}: ProductFormProps) {
  const { user } = useUser(); // Hook pour récupérer l'utilisateur connecté
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryName, setCategoryName] = useState<string | null>(null); // Utiliser le nom de la catégorie
  const [instock, setInStock] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategoryName = categoryName;

    // Si l'utilisateur crée une nouvelle catégorie
    if (isCreatingCategory && newCategoryName) {
      try {
        const newCategory = await addCategory(newCategoryName);
        if (!newCategory) {
          alert("Erreur lors de la création de la catégorie");
          return;
        }
        finalCategoryName = newCategory.name; // Utiliser le nom de la nouvelle catégorie
      } catch (error) {
        console.error("Erreur lors de la création de la catégorie", error);
        return;
      }
    }

    if (!finalCategoryName) {
      alert("Veuillez sélectionner une catégorie ou en créer une.");
      return;
    }

    // Vérifier que l'utilisateur est bien connecté avant de soumettre le produit
    if (!user) {
      alert(
        "Aucun utilisateur connecté. Veuillez vous connecter pour créer un produit."
      );
      return;
    }

    // Créer le nouvel objet produit avec finalCategoryName au lieu de category_id
    const newProduct = {
      name,
      description,
      price,
      categoryname: finalCategoryName, // Utiliser le nom de la catégorie
      instock,
      userid: user.id,
    };

    onSubmit(newProduct); // Envoyer le produit avec le nom de la catégorie
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom du produit
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Prix</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="mt-1 block w-full text-black py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Catégorie
        </label>
        <select
          value={isCreatingCategory ? "new" : categoryName ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "new") {
              setIsCreatingCategory(true);
              setCategoryName(null);
            } else {
              setIsCreatingCategory(false);
              setCategoryName(value);
            }
          }}
          required
          className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">-- Sélectionnez une catégorie --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
          <option value="new">+ Créer une nouvelle catégorie</option>
        </select>
      </div>

      {isCreatingCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouvelle catégorie
          </label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={instock}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm font-medium text-gray-700">
          Disponible en stock
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700"
      >
        Ajouter le produit
      </button>
    </form>
  );
}
