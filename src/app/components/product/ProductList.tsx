import ProductCard from "./ProductCard";

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
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: ProductListProps) {
  // Vérifie si 'products' est bien un tableau avant d'essayer d'utiliser .map()
  if (!Array.isArray(products)) {
    console.log(products);
    return <p>Aucun produit disponible</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
