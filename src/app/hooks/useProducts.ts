'use client';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  categoryId: number;
  userId: number;
  createdAt: Date;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la liste des produits
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un produit
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        await fetchProducts(); // Recharger les produits après ajout
      } else {
        setError('Erreur lors de l\'ajout du produit');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  // Modifier un produit
  const updateProduct = async (product: Product) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        await fetchProducts(); // Recharger les produits après modification
      } else {
        setError('Erreur lors de la modification du produit');
      }
    } catch (err) {
      setError('Erreur lors de la modification du produit');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchProducts(); // Recharger les produits après suppression
      } else {
        setError('Erreur lors de la suppression du produit');
      }
    } catch (err) {
      setError('Erreur lors de la suppression du produit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  };
}
