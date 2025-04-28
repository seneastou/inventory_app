'use client'; // Utilisation côté client pour permettre les hooks

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/app/hooks/useProducts'; // Assurez-vous que ce type est bien exporté
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams(); // Récupérer les paramètres de l'URL
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les détails du produit
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/products/${id}`);
          if (!res.ok) {
            throw new Error('Erreur lors de la récupération du produit');
          }
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          setError('Erreur lors de la récupération du produit');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <p>Chargement du produit...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Produit introuvable</p>;
  }

  return (
    <main>
      <Link href="/products">
          <button className="text-blue-600 hover:underline">
            Retour à la liste des produits
          </button>
        </Link>
      <h1 className='text-bold text-center mt-4 text-2xl'>Détails du produit</h1>
    <div className="max-w-xl text-center mx-auto p-6 bg-white text-gray-700 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg font-semibold mt-4">Prix: {product.price.toString().replace(".", ",")}€</p>
      <p className="mt-2 font-semibold">
        Catégorie: {product.categoryName || 'Non spécifiée'}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Créé le: {new Date(product.createdAt).toLocaleDateString()}
      </p>
      <p className={`mt-4 text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
        {product.inStock ? 'En stock' : 'Rupture de stock'}
      </p>

      <div className="mt-6">
        <Link href={`/products/${id}/edit`}>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
            Modifier
          </button>
        </Link>
        
      </div>
    </div>
    </main>
  );
}
