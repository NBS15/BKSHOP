import { useState } from 'react';
import type { Product } from '../../types';
 
interface Props {
  product: Product;
  initialSize?: string;
  initialColor?: string;
  onClose: () => void;
  onConfirm: (size: string, color: string) => void;
}
 
export default function ProductPurchaseModal({
  product,
  initialSize = 'M',
  initialColor = 'Noir',
  onClose,
  onConfirm,
}: Props) {
  const [size, setSize] = useState(initialSize);
  const [color, setColor] = useState(initialColor);
 
  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="card-modal animate-scale-in w-full sm:w-auto sm:max-w-[85vw]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col items-center justify-center">
            <figure className="w-full h-[260px] sm:h-80 bg-base-200 rounded-xl overflow-hidden flex items-center justify-center mb-3 sm:mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-3/4 h-3/4 object-contain p-2 sm:p-4"
              />
            </figure>
            <div className="flex items-baseline gap-3">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{product.price}€</p>
              {product.originalPrice && (
                <p className="text-sm sm:text-base line-through opacity-50">{product.originalPrice}€</p>
              )}
            </div>
          </div>
 
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{product.name}</h2>
              <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">Catégorie: {product.category}</p>
 
              <div className="mb-4 sm:mb-6 card bg-base-200 p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Taille</h3>
                <div className="flex gap-2 flex-wrap">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`btn btn-sm sm:btn-md ${size === s ? 'btn-primary' : 'btn-outline btn-primary'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
 
              <div className="mb-4 sm:mb-6 card bg-base-200 p-3 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Couleur</h3>
                <div className="flex gap-3 flex-wrap">
                  {['Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Gris'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg transition-all hover:scale-110"
                      title={c}
                      style={{
                        backgroundColor:
                          c === 'Noir' ? '#000'
                          : c === 'Blanc' ? '#fff'
                          : c === 'Bleu' ? '#3b82f6'
                          : c === 'Rouge' ? '#ef4444'
                          : c === 'Vert' ? '#22c55e'
                          : c === 'Gris' ? '#9ca3af'
                          : '#fff',
                        border: color === c ? '3px solid var(--fallback-p, #6366f1)' : '1px solid #ccc',
                        boxShadow: color === c ? '0 0 8px rgba(99, 102, 241, 0.5)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
 
              <div className="p-3 sm:p-4 bg-base-200 rounded-lg">
                {product.stock !== undefined && (
                  product.stock > 0 ? (
                    <span className="text-sm sm:text-base text-success">✓ {product.stock} produits en stock</span>
                  ) : (
                    <span className="text-sm sm:text-base text-error">✗ Rupture de stock</span>
                  )
                )}
              </div>
            </div>
 
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button onClick={onClose} className="btn btn-ghost w-full sm:flex-1">
                Annuler
              </button>
              <button
                onClick={() => onConfirm(size, color)}
                disabled={product.stock === 0}
                className="btn btn-primary w-full sm:flex-1"
              >
                ✓ Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
