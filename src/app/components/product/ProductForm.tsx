'use client';
import { useState } from 'react';

interface ProductFormProps {
  initialProduct?: {
    name: string;
    description: string;
    price: number;
    categoryId: number;  // number
    inStock: boolean;
    userId: number;  // number
  };
  onSubmit: (product: { name: string; description: string; price: number; categoryId: number; inStock: boolean; userId: number }) => void;
}

export default function ProductForm({ initialProduct, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [price, setPrice] = useState(initialProduct?.price || 0);
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || 0);
  const [inStock, setInStock] = useState(initialProduct?.inStock || false);
  const [userId, setUserId] = useState(initialProduct?.userId || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, price, categoryId, inStock, userId });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Ajouter / Modifier un produit</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Prix</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Catégorie ID</label>
        <input
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Propriétaire (User ID)</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Disponible en stock</label>
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md shadow hover:bg-indigo-700">
        Enregistrer
      </button>
    </form>
  );
}
