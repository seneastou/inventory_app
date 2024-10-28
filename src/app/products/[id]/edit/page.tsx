'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '../../../components/product/ProductCard';
import { useProducts } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import ProductForm from '../../../components/product/ProductForm';
import { useUser } from "../../../../context/UserContext";


export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const { updateProduct } = useProducts();
  const { categories, fetchCategories, addCategory } = useCategories();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, setUser } = useUser();

  // Fetch les détails du produit pour pré-remplir le formulaire
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/products/${id}`);
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Erreur lors de la récupération du produit :', error);
        }
      }
    };

    fetchProduct();
    fetchCategories(); // Fetch les catégories disponibles
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (updatedProduct: Omit<Product, "createdat">) => {
    try {
      await updateProduct({ 
        ...updatedProduct, 
        id: Number(id), 
      });
      router.push("/products"); // Rediriger vers la liste des produits après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit", error);
    }
  };
  if (!product) {
    return <p>Chargement du produit...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl text-center text-black font-bold mb-4">Modifier le produit</h1>

      {/* Formulaire de modification pré-rempli */}
      <ProductForm
        onSubmit={handleSubmit}
        categories={categories}
        addCategory={addCategory}
        initialProduct={product} // Passer les données actuelles du produit au formulaire
      />
    </div>
  );
}
