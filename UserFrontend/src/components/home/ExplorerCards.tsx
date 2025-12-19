import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductCard from '../common/ProductCard';

interface ExplorerCardsProps {
  onStartCheckout?: (product: Product, taille: string, couleur: string) => void;
  likedIds: string[];
  toggleLike: (id: string) => void;
}

export function ExplorerCards({ onStartCheckout, likedIds, toggleLike }: ExplorerCardsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const defaultSize = 'M';
  const defaultColor = 'Noir';

  useEffect(() => {
    const fetchBestProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/metrics`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error('Failed to fetch best products', e);
      }
    };
    fetchBestProducts();
  }, [likedIds]);

  const handleCommander = (product: Product) => {
    if (onStartCheckout) onStartCheckout(product, defaultSize, defaultColor);
  };


  if (products.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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

      {/* Suppression des modales de produit */}
    </>
  );
}
