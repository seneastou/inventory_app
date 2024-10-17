interface Product {
  id: number;  
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  categoryId: number; 
  userId: number;  
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="border p-4 rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-semibold">Prix: {product.price}€</p>
      <p className="font-semibold">Catégorie ID: {product.categoryId}</p>
      <p className="font-semibold">Propriétaire (User ID): {product.userId}</p>
      <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
        {product.inStock ? 'En stock' : 'Rupture de stock'}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
