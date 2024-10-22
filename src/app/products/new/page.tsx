"use client";
import { useEffect } from "react";
import { useUser } from "../../../context/UserContext"; // Assurez-vous que ce context est configuré
import { useProducts } from "../../hooks/useProducts"; // Assurez-vous que ce hook est configuré
import { useCategories } from "../../hooks/useCategories"; // Assurez-vous que ce hook est configuré
import ProductForm from "../../components/product/ProductForm";
import { Product } from "../../hooks/useProducts";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const { user, setUser } = useUser(); // Récupérer l'utilisateur actuel
  const { addProduct } = useProducts();
  const { categories, fetchCategories, addCategory } = useCategories();
  const router = useRouter();

  useEffect(() => {
    fetchCategories(); // Récupérer les catégories lors du montage
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (
    newProduct: Omit<Product, "id" | "createdat">
  ) => {
    try {
      if (!user) {
        console.error("Utilisateur non connecté");
        return;
      }

      const productWithUser = { ...newProduct, userId: user.id }; // Ajouter userId
      await addProduct(productWithUser);

      // Rediriger vers la page des produits après l'ajout réussi
      router.push("/products");
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit", error);
    }
  };

  return (
    <main>
      <Link href="/products" className="text-blue-600 hover:underline">
        Retour à la liste des produits
      </Link>
      <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl text-black font-bold mb-4">
          Ajouter un nouveau produit
        </h1>

        {/* Afficher le formulaire de création de produit */}
        <ProductForm
          onSubmit={handleSubmit}
          categories={categories}
          addCategory={addCategory}
        />
      </div>
    </main>
  );
}
