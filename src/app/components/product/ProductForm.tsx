"use client";
import { useState, useEffect } from "react";
import { Product } from "./ProductCard";
import { useUser } from "../../../context/UserContext"; // Assurez-vous que ce contexte utilisateur est bien configuré

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "createdat">) => void;
  categories: { id: number; name: string }[];
  addCategory: (name: string) => Promise<{ id: number; name: string } | null>;
  initialProduct?: Product; // Ajoutez cette propriété pour accepter un produit prérempli
}

export default function ProductForm({
  onSubmit,
  categories,
  addCategory,
  initialProduct, // Produit initial (pour l'édition)
}: ProductFormProps) {
  const { user } = useUser(); // Hook pour récupérer l'utilisateur connecté
  const [name, setName] = useState(initialProduct?.name || ""); // Utilisez les données initiales si disponibles
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [price, setPrice] = useState(initialProduct?.price || 0);
  const [categoryName, setCategoryName] = useState<string | null>(initialProduct?.categoryname || null);
  const [instock, setInStock] = useState(initialProduct?.instock || false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategoryName = categoryName;

    if (isCreatingCategory && newCategoryName) {
      try {
        const newCategory = await addCategory(newCategoryName);
        if (!newCategory) {
          alert("Erreur lors de la création de la catégorie");
          return;
        }
        finalCategoryName = newCategory.name;
      } catch (error) {
        console.error("Erreur lors de la création de la catégorie", error);
        return;
      }
    }

    if (!finalCategoryName) {
      alert("Veuillez sélectionner une catégorie ou en créer une.");
      return;
    }

    if (!user) {
      alert("Aucun utilisateur connecté. Veuillez vous connecter pour créer un produit.");
      return;
    }

    const updatedProduct = {
      id: initialProduct?.id ?? 0, // Include the id if it exists, otherwise default to 0
      name,
      description,
      price,
      categoryname: finalCategoryName,
      instock,
      userid: user.id,
    };

    onSubmit(updatedProduct); // Envoyer le produit avec les données mises à jour
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Les champs du formulaire sont préremplis grâce aux valeurs initiales */}
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
        <label className="ml-2 block text-sm font-medium text-gray-700">Disponible en stock</label>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700"
      >
        Sauvegarder
      </button>
    </form>
  );
}
