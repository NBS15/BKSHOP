import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductCard from '../common/ProductCard';

function FavorisEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">💔</div>
      <h3 className="text-2xl font-bold mb-2">Aucun favori pour le moment</h3>
      <p className="text-base-content/60 max-w-md mx-auto">
        Explorez nos collections et ajoutez des articles à vos favoris pour les retrouver ici.
      </p>
    </div>
  );
}

interface FavorisListProps {
  likedIds: string[];
  onStartCheckout?: (product: Product, taille: string, couleur: string) => void;
  toggleLike: (id: string) => void;
}

export function FavorisList({ likedIds, onStartCheckout, toggleLike }: FavorisListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const defaultSize = 'M';
  const defaultColor = 'Noir';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data: Product[] = await res.json();
        setProducts(data.filter(p => likedIds.includes(p.id)));
      } catch (e) {
        console.error('Failed to fetch products', e);
      } finally {
        setLoading(false);
      }
    };
    if (likedIds.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [likedIds]);

  const handleCommander = (product: Product) => {
    if (onStartCheckout) onStartCheckout(product, defaultSize, defaultColor);
  };


  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (products.length === 0) {
    return <FavorisEmpty />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isLiked={true}
            onLike={toggleLike}
            onCommand={() => handleCommander(product)}
          />
        ))}
      </div>
      {/* Suppression des modales de produit */}
    </>
  );
}
