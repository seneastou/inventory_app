export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  instock: boolean;
  categoryname: string; // Ajout du nom de la catégorie
  userid: number;
  createdat: Date; // Ajout de la date de création
}
interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="border p-4 rounded-lg text-center shadow-lg bg-white text-gray-700">
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-semibold">Prix: {product.price}€</p>

      {/* Affichage du nom de la catégorie */}
      <p className="font-semibold">
        Catégorie: {product.categoryname || "Non spécifiée"}
      </p>

      {/* Affichage de l'ID du propriétaire */}
      <p className="font-semibold">User ID: {product.userid}</p>

      {/* Affichage de la disponibilité du produit */}
      <p
        className={`text-sm ${
          product.instock ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.instock ? "En stock" : "Rupture de stock"}
      </p>

      {/* Affichage de la date de création */}
      <p className="text-sm text-gray-500">
        Créé le : {new Date(product.createdat).toLocaleDateString()}
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
