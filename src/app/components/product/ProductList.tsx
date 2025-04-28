import { useState } from "react";
import ProductCard, { Product } from "./ProductCard";
import Pagination from "../pagination/Pagination"; 
import { useProducts } from "../../hooks/useProducts";
import toast from "react-hot-toast";

interface ProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const PRODUCTS_PER_PAGE = 9;

export default function ProductList({ products, onDelete }: ProductListProps) {
  const { deleteProduct } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      onDelete(productId);
    } catch (error) {
    }
  };

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  if (products.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
        Aucun produit trouvé pour le moment.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination en dessous */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
