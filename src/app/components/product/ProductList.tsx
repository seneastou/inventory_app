import ProductCard from './ProductCard';

interface Product {
  id: number;  
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  categoryId: number;  
  userId: number; 
} 

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

