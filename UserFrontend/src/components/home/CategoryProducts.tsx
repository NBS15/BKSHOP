import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductCard from '../common/ProductCard';

interface CategoryProductsProps {
  category: string;
  onBack: () => void;
  onStartCheckout?: (product: Product, taille: string, couleur: string) => void;
  likedIds: string[];
  toggleLike: (id: string) => void;
}

export function CategoryProducts({
  category,
  onBack,
  onStartCheckout,
  likedIds,
  toggleLike,
}: CategoryProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const defaultSize = 'M';
  const defaultColor = 'Noir';

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/category/${category}`
        );
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const handleCommander = (product: Product) => {
    if (onStartCheckout) onStartCheckout(product, defaultSize, defaultColor);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm"
        >
          ← Retour
        </button>
        <h2 className="text-3xl font-bold">🛍️ {category}</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-base-content/60">
          <p className="text-xl">Aucun produit disponible dans cette catégorie</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const isLiked = likedIds.includes(product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={isLiked}
                onLike={toggleLike}
                onCommand={() => handleCommander(product)}
              />
            );
          })}
        </div>
      )}

      {/* Suppression des modales de produit */}
    </div>
  );
}
