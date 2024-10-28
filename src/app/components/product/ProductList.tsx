import ProductCard from "./ProductCard";
import { useProducts } from '../../hooks/useProducts';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  instock: boolean;
  categoryname: string;
  userid: number;
  createdat: Date;
}

interface ProductListProps {
  products: Product[]; // Assurer que 'products' est supposé être un tableau
  onDelete: (id: number) => void;
}

export default function ProductList({products, onDelete}: ProductListProps) {

  const { deleteProduct } = useProducts();
  // Vérifie si 'products' est bien un tableau avant d'essayer d'utiliser .map()
  if (!Array.isArray(products)) {
    console.log(products);
    return <p>Aucun produit disponible</p>;
  }

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId); // Appeler l'API pour supprimer le produit
      onDelete(productId); 
      console.log("Produit supprimé :", productId);
    } catch (error) {
      console.error("Erreur lors de la suppression du produit", error);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
