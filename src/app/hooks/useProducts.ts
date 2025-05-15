"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import toast from 'react-hot-toast';
import { useHistory } from "./useHistory";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  inStock: boolean;
  userId: string;
  createdAt: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useUser();
  const { addHistory } = useHistory();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/products`);
      if (res.ok) {
        const data = await res.json();
        const productsWithDate: Product[] = data.map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          categoryName: product.categoryName,
          inStock: Boolean(product.inStock),
          userId: String(product.userId),
          createdAt: String(product.createdAt),
        }));

        if (Array.isArray(productsWithDate)) {
          setProducts(productsWithDate);
        } else {
          setError("La réponse de l'API des produits n'est pas un tableau");
        }
      } else {
        setError("Erreur lors de la récupération des produits");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des produits");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Produit ajouté avec succès !");
        await fetchProducts();
        if (user) {
          await addHistory({
            action: "Ajout de produit",
            quantity: 1,
            userId: user.id,
            productId: data.id,
          });
        }
      } else {
        setError(data.error || "Erreur lors de l'ajout du produit");
        toast.error(data.error || "Erreur lors de l'ajout du produit");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout du produit");
      toast.error("Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Omit<Product, "createdAt">) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        toast.success("Produit modifié avec succès !");
        await fetchProducts();
        if (user) {
          await addHistory({
            action: "Modification de produit",
            userId: user.id,
            productId: product.id,
          });
        }
      } else {
        setError("Erreur lors de la mise à jour du produit");
      }
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du produit");
      setError("Erreur lors de la mise à jour du produit");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Produit supprimé avec succès !");
        setProducts((prev) => prev.filter((product) => product.id !== id));
        if (user) {
          await addHistory({
            action: "Suppression de produit",
            userId: user.id,
            productId: id,
          });
        }
      } else {
        setError("Erreur lors de la suppression du produit");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression du produit");
      setError("Erreur lors de la suppression du produit");
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
    fetchProducts,
    loading,
    error,
  };
}
