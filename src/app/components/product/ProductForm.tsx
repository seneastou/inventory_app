"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "./ProductCard";
import { useUser } from "../../../context/UserContext";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "createdAt">) => void;
  categories: { id: number; name: string }[];
  addCategory: (name: string) => Promise<{ id: number; name: string } | null>;
  initialProduct?: Product;
}

export default function ProductForm({
  onSubmit,
  categories,
  addCategory,
  initialProduct,
}: ProductFormProps) {
  const { user } = useUser();

  const [name, setName] = useState(initialProduct?.name || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [price, setPrice] = useState(initialProduct?.price || 0);
  const [categoryName, setCategoryName] = useState<string | null>(initialProduct?.categoryName || null);
  const [inStock, setInStock] = useState(initialProduct?.inStock || false);

  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategoryName = categoryName;

    if (isCreatingCategory && newCategoryName) {
      try {
        const newCategory = await addCategory(newCategoryName);
        if (!newCategory) {
          toast.error("Erreur lors de la création de la catégorie");
          return;
        }
        finalCategoryName = newCategory.name;
        toast.success("Catégorie créée avec succès !");
      } catch (error) {
        console.error("Erreur lors de la création de la catégorie", error);
        toast.error("Erreur serveur lors de la création");
        return;
      }
    }

    if (!finalCategoryName) {
      toast.error("Veuillez sélectionner ou créer une catégorie.");
      return;
    }

    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un produit.");
      return;
    }

    const updatedProduct = {
      id: initialProduct?.id ?? "",
      name,
      description,
      price,
      categoryName: finalCategoryName,
      inStock,
    };

    onSubmit(updatedProduct);
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom du produit</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
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
          <label className="block text-sm font-medium text-gray-700">Catégorie</label>
          <select
            value={isCreatingCategory ? "new" : categoryName ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "new") {
                setIsCreatingCategory(true);
                setCategoryName(null);
                setNewCategoryName("");
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
            <label className="block text-sm font-medium text-gray-700">Nouvelle catégorie</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nom de la nouvelle catégorie"
              required
              className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">Disponible en stock</label>
        </div>

        <button
          type="submit"
          disabled={!name || !description || !price }
          className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700 disabled:opacity-50"
        >
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
