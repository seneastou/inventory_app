"use client";
import { useEffect } from "react";
import { useUser } from "../../../context/UserContext"; // Assurez-vous que ce context est configuré
import { useProducts } from "../../hooks/useProducts"; // Assurez-vous que ce hook est configuré
import { useCategories } from "../../hooks/useCategories"; // Assurez-vous que ce hook est configuré
import ProductForm from "../../components/product/ProductForm";
import { Product } from "../../hooks/useProducts";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const { user, setUser } = useUser(); // Récupérer l'utilisateur actuel
  const { addProduct } = useProducts();
  const { categories, fetchCategories, addCategory } = useCategories();
  const router = useRouter();

  useEffect(() => {
    fetchCategories(); // Récupérer les catégories lors du montage
  }, []);

  const handleSubmit = async (
    newProduct: Omit<Product, "id" | "createdAt" | "userId">
  ) => {
    try {
      if (!user || !user.companyId) {
        console.error("Utilisateur non connecté ou sans entreprise");
        return;
      }
  
      const productWithUser = {
        ...newProduct,
        userId: String(user.id),
        companyId: user.companyId,
      };
  
      await addProduct(productWithUser);
      router.push("/products");
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit", error);
    }
  };

  return (
    <main>
      <Link href="/products" className="flex items-center text-blue-600 hover:underline">
  <ArrowLeft className="w-5 h-5 mr-6" />
  
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
