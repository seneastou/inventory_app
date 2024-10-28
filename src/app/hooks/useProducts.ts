"use client";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryname: string;
  instock: boolean;
  userid: number;
  createdat: Date; // Converti en Date ici
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Méthode pour récupérer les produits depuis l'API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/products");
      if (res.ok) {
        const data = await res.json();
        
        const productsWithDate = data.map((product: any) => ({
          ...product,
          createdat: new Date(product.createdat), // Utiliser `createdat`
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

  // Ajouter un produit
  const addProduct = async (product: Omit<Product, "id" | "createdat">) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product), // Le produit inclut userId ici
      });
      const data = await res.json();
      if (res.ok) {
        fetchProducts(); // Recharger les produits après l'ajout
      } else {
        setError("Erreur lors de l'ajout du produit");
      }
    } catch (err) {
      setError("Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un produit
  const updateProduct = async (product: Omit<Product, "createdat">) => {
    setLoading(true);
    try {
      
      const res = await fetch(
        `http://localhost:3000/api/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      if (res.ok) {
        fetchProducts(); // Recharger les produits après la mise à jour
      } else {
        setError("Erreur lors de la mise à jour du produit");
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du produit");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un produit
  const deleteProduct = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      } else {
        setError("Erreur lors de la suppression du produit");
      }
    } catch (err) {
      setError("Erreur lors de la suppression du produit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Récupérer les produits lors du montage du composant
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
