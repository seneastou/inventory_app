"use client";
import { useUser } from "../../context/UserContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductList from "../components/product/ProductList";
import CategoryFilter from "../components/category/CategoryFilter";
import StockFilter from "../components/stock/StockFilter";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { products, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<boolean | null>(null);
  const { user, loadingUser } = useUser();


  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && (!user || !user.isActive)) {
      toast.error("Veuillez vous connecter.");
      router.push("/users");
    }
  }, [loadingUser, user, router]);

  // ✅ Redirection sécurisée après chargement complet
  useEffect(() => {
    if (user?.companyId) {
      fetchProducts(user.companyId); // ✅ passer companyId
    }
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (Array.isArray(products)) {
      let filtered = [...products];

      if (selectedCategoryName) {
        filtered = filtered.filter(
          (product) => product.categoryName === selectedCategoryName
        );
      }

      if (stockFilter !== null) {
        filtered = filtered.filter(
          (product) => product.inStock === stockFilter
        );
      }

      setFilteredProducts(filtered);
    }
  }, [selectedCategoryName, stockFilter, products]);

  const handleCategoryFilter = (categoryName: string | null) => {
    setSelectedCategoryName(categoryName);
  };

  const handleStockFilter = (inStock: boolean | null) => {
    setStockFilter(inStock);
  };

  // ⏳ Affichage du chargement pendant la récupération de l'utilisateur
  if (loadingUser) {
    return <p className="text-center mt-10">Chargement...</p>;
  }

  if (!user || !user.isActive) {
    return null;
  } 

  return (
    <main>
      <Link href="/users" className="flex items-center text-blue-600 hover:underline">
        <ArrowLeft className="w-5 h-5 mr-6" />
      </Link>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Liste des produits
        </h1>

        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/3">
            <CategoryFilter
              categories={Array.isArray(categories) ? categories : []}
              onFilterChange={handleCategoryFilter}
            />
          </div>

          <div className="w-full md:w-1/3 flex justify-center">
            <Link
              href="/products/new"
              className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 transition"
            >
              ➕ Ajouter un produit
            </Link>
          </div>

          <div className="w-full md:w-1/3 flex justify-end">
            <StockFilter onFilterChange={handleStockFilter} />
          </div>
        </div>

        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          <ProductList
            products={filteredProducts}
            onDelete={(id: string) => {
              setFilteredProducts(filteredProducts.filter(product => product.id !== id));
            }}
          />
        ) : (
          <p>Aucun produit disponible.</p>
        )}
      </div>
    </main>
  );
}
