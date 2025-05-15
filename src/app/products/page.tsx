"use client";
import { useUser } from "../../context/UserContext"; // Utiliser le contexte de l'utilisateur
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductList from "../components/product/ProductList";
import CategoryFilter from "../components/category/CategoryFilter";
import StockFilter from "../components/stock/StockFilter";
import { useProducts } from "../hooks/useProducts"; // Utiliser le hook des produits
import { useCategories } from "../hooks/useCategories"; // Utiliser le hook des catégories
import { ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const { products, fetchProducts } = useProducts(); // Hook pour gérer les produits
  const { categories, fetchCategories } = useCategories(); // Hook pour gérer les catégories
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null); // Utiliser le nom de la catégorie
  const [stockFilter, setStockFilter] = useState<boolean | null>(null);
  const { user, setUser } = useUser();

  // Récupérer les produits et les catégories lors du montage
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Appliquer les filtres à chaque changement des filtres ou des produits
  useEffect(() => {
    if (Array.isArray(products)) {
      // Vérifier que products est un tableau
      let filtered = [...products];

      if (selectedCategoryName) {
        filtered = filtered.filter(
          (product) => product.categoryName === selectedCategoryName
        ); // Filtrer par nom de catégorie
      }

      if (stockFilter !== null) {
        filtered = filtered.filter(
          (product) => product.inStock === stockFilter
        );
      }

      setFilteredProducts(filtered);
    } else {
      console.error("Products n'est pas un tableau", products);
    }
  }, [selectedCategoryName, stockFilter, products]);

  const handleCategoryFilter = (categoryName: string | null) => {
    setSelectedCategoryName(categoryName); // Utiliser le nom de la catégorie
  };

  const handleStockFilter = (inStock: boolean | null) => {
    setStockFilter(inStock);
  };

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
  {/* Filtrer par catégories à gauche */}
  <div className="w-full md:w-1/3">
    <CategoryFilter
      categories={Array.isArray(categories) ? categories : []}
      onFilterChange={handleCategoryFilter}
    />
  </div>

  {/* Bouton Ajouter au centre */}
  <div className="w-full md:w-1/3 flex justify-center">
    <Link
      href="/products/new"
      className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 transition"
    >
      ➕ Ajouter un produit
    </Link>
  </div>

  {/* Filtrer par disponibilité à droite */}
  <div className="w-full md:w-1/3 flex justify-end">
    <StockFilter onFilterChange={handleStockFilter} />
  </div>
</div>

        {/* Liste des produits filtrés */}
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
