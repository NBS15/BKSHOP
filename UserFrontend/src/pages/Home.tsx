import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import type { Product } from '../types';
import { SEO } from '../components/SEO';
import { Header } from '../components/home/Header';
import { StyleCards } from '../components/home/StyleCards';
import { ExplorerCards } from '../components/home/ExplorerCards';
import { FavorisList } from '../components/home/FavorisList';
import { CategoryProducts } from '../components/home/CategoryProducts';
import { SalesList } from '../components/home/SalesList';

interface HomeProps {
  view?: 'style' | 'sales';
}

export default function Home({ view = 'style' }: HomeProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'style' | 'explorer' | 'favoris'>('style');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('likedProducts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedIds));
  }, [likedIds]);

  const toggleLike = (id: string) => {
    if (!user) {
      alert('Veuillez vous connecter pour gérer vos favoris');
      return;
    }
    setLikedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStartCheckout = (product: Product, taille: string, couleur: string) => {
    navigate('/checkout', {
      state: {
        product,
        taille,
        couleur,
      },
    });
  };

  if (view === 'sales') {
    return (
        <>
            <SEO 
                title="Soldes | BK Shop" 
                description="Profitez de nos offres exceptionnelles sur une large sélection de vêtements."
            />
            <SalesList 
                onStartCheckout={handleStartCheckout}
                likedIds={likedIds}
                toggleLike={toggleLike}
            />
        </>
    );
  }

  return (
    <div className="space-y-12">
      <SEO 
        title="Accueil | BK Shop" 
        description="Découvrez la nouvelle collection BK Shop. Mode urbaine, qualité premium."
      />

      {selectedCategory ? (
        <CategoryProducts 
          category={selectedCategory} 
          onBack={() => setSelectedCategory(null)}
          onStartCheckout={handleStartCheckout}
          likedIds={likedIds}
          toggleLike={toggleLike}
        />
      ) : (
        <>
          <Header />
          
          <div className="tabs tabs-boxed justify-center mb-8 bg-base-200 p-2 rounded-full max-w-md mx-auto">
            <a 
              className={`tab tab-lg rounded-full transition-all duration-300 ${tab === 'style' ? 'tab-active bg-primary text-primary-content shadow-md' : 'hover:bg-base-300'}`}
              onClick={() => setTab('style')}
            >
              Collections
            </a>
            <a 
              className={`tab tab-lg rounded-full transition-all duration-300 ${tab === 'explorer' ? 'tab-active bg-primary text-primary-content shadow-md' : 'hover:bg-base-300'}`}
              onClick={() => setTab('explorer')}
            >
              Meilleurs Ventes
            </a>
            <a 
              className={`tab tab-lg rounded-full transition-all duration-300 ${tab === 'favoris' ? 'tab-active bg-primary text-primary-content shadow-md' : 'hover:bg-base-300'}`}
              onClick={() => setTab('favoris')}
            >
              Favoris {likedIds.length > 0 && <span className="badge badge-sm badge-ghost ml-2">{likedIds.length}</span>}
            </a>
          </div>

          <div className="animate-fade-in">
            {tab === 'style' && (
              <StyleCards onSelectCategory={setSelectedCategory} />
            )}
            
            {tab === 'explorer' && (
              <ExplorerCards 
                onStartCheckout={handleStartCheckout}
                likedIds={likedIds}
                toggleLike={toggleLike}
              />
            )}
            
            {tab === 'favoris' && (
              <FavorisList 
                likedIds={likedIds}
                onStartCheckout={handleStartCheckout}
                toggleLike={toggleLike}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
