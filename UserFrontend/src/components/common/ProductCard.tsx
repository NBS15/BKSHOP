import type { Product } from '../../types';
 
interface Props {
  product: Product;
  isLiked: boolean;
  onLike: (id: string) => void;
  onCommand: () => void;
}
 
function formatPriceDA(value: number | string) {
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return `${value}da`;
  return `${n.toLocaleString('fr-DZ')}da`;
}
 
export default function ProductCard({ product, isLiked, onLike, onCommand }: Props) {
  return (
    <article
      className="card-modern"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onCommand();
        if (e.key === ' ') {
          e.preventDefault();
          onLike(product.id);
        }
      }}
      aria-label={`Carte produit ${product.name}`}
    >
      <figure className="relative aspect-square overflow-hidden bg-base-200 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full w-auto h-auto object-contain p-4 transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
          decoding="async"
        />
        <button
          type="button"
          className={`absolute top-3 right-3 btn btn-circle btn-sm shadow-md border-0 transition-transform hover:scale-110 focus:scale-105 ${isLiked ? 'bg-red-600 text-white' : 'bg-white/90 text-gray-600'}`}
          aria-pressed={isLiked}
          aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={(e) => {
            e.stopPropagation();
            onLike(product.id);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.1 21.35l-1.1-.99C5.14 15.24 2 12.39 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.59 4.81 14.26 4 16 4 18.5 4 20.5 6 20.5 8.5c0 3.89-3.14 6.74-8.9 11.86l-1.5 0.99z" />
          </svg>
        </button>
      </figure>
 
      <div className="card-body p-6">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold truncate">{product.name}</h3>
            <p className="text-xs text-base-content/60">❤️ {product.favorites || 0}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg sm:text-xl font-extrabold text-primary">{formatPriceDA(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-base-content/50 line-through">{formatPriceDA(product.originalPrice)}</p>
            )}
          </div>
        </div>
 
        <div className="card-actions mt-4">
          <button
            type="button"
            className="btn btn-primary w-full sm:w-auto rounded-full active:scale-95"
            onClick={onCommand}
            aria-label={`Commander ${product.name}`}
          >
            Commander
          </button>
        </div>
      </div>
    </article>
  );
}
