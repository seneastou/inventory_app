import { FiTag, FiBox, FiCalendar, FiTrash2 } from "react-icons/fi";
import Link from "next/link";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  categoryName: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <div className="relative group">
      <Link
        href={`/products/${product.id}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">Voir le produit</span>
      </Link>

      <div className="bg-white shadow-xl rounded-2xl p-6 text-gray-800 space-y-4 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-bold group-hover:underline">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm">{product.description}</p>

        <div className="flex items-center gap-2 text-sm">
  <FiTag />
  <span className="font-medium">
    Prix : {product.price.toFixed(2).replace(".", ",")} €
  </span>
</div>

        <div className="flex items-center gap-2 text-sm">
          <FiBox />
          <span className="font-medium">
            Catégorie : {product.categoryName || "Non spécifiée"}
          </span>
        </div>

        <div
          className={`text-sm font-medium ${
            product.inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {product.inStock ? "✔ En stock" : "❌ Rupture de stock"}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
  <FiCalendar />
  <span>
    {product.createdAt
      ? new Date(product.createdAt).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date inconnue"}
  </span>
</div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 z-20 relative"
        >
          <FiTrash2 />
          Supprimer
        </button>
      </div>
    </div>
  );
}
