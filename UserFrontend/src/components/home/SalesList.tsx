import { useState, useEffect } from 'react';
import type { Product } from '../../types';
import ProductCard from '../common/ProductCard';
import { Header } from './Header';

interface SalesListProps {
  onStartCheckout?: (product: Product, taille: string, couleur: string) => void;
  likedIds: string[];
  toggleLike: (id: string) => void;
}

export function SalesList({ onStartCheckout, likedIds, toggleLike }: SalesListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const defaultSize = 'M';
  const defaultColor = 'Noir';

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/sales`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error('Failed to fetch sales', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

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

  return (
    <>
      <Header />
      <div className="text-center mb-8 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-500">🔥 Offres Exceptionnelles 🔥</h2>
        <p className="text-base sm:text-lg opacity-70">Profitez de nos réductions limitées</p>
      </div>

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
      
      {/* Suppression des modales de produit */}
    </>
  );
}
