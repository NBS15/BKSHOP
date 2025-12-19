import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'en_attente':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'en_preparation':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'en_cours': // Keep for backward compatibility or transition
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'pret':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'livre':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'annule':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'en_attente':
      return '⏳ En attente';
    case 'en_preparation':
      return '👨‍🍳 En préparation';
    case 'en_cours':
      return '⏳ En cours';
    case 'pret':
      return '✅ Prêt';
    case 'livre':
      return '📦 Livré';
    case 'annule':
      return '❌ Annulé';
    default:
      return status;
  }
};

export default function Cart() {
  const { orders, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  return (
    <>
      <SEO title="Mon Panier" description="Gérez vos commandes et suivez leur statut." />
      <div className="container mx-auto max-w-5xl px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Mon Panier
            </h1>
            <p className="text-gray-500 font-medium">Gérez vos commandes et suivez leur statut</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost gap-2 hover:bg-white/50 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour au shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-float">
              <span className="text-4xl">🛒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-8 max-w-md">Il semble que vous n'ayez pas encore ajouté d'articles. Découvrez nos dernières collections !</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="glass-effect rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  {/* Image */}
                  <figure className="w-full md:w-48 aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent opacity-50" />
                    <img
                      src={order.product.image}
                      alt={order.product.name}
                      className="w-3/4 h-3/4 object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </figure>

                  {/* Infos principales */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">{order.product.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {order.product.category}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">{order.product.price}€</p>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm mb-6">
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/50">
                          <span className="text-xs font-bold text-gray-500 uppercase">Taille</span>
                          <span className="font-semibold text-gray-800">{order.taille}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/50">
                          <span className="text-xs font-bold text-gray-500 uppercase">Couleur</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                              style={{
                                backgroundColor:
                                  order.couleur === 'Noir' ? '#000'
                                  : order.couleur === 'Blanc' ? '#fff'
                                  : order.couleur === 'Bleu' ? '#3b82f6'
                                  : order.couleur === 'Rouge' ? '#ef4444'
                                  : order.couleur === 'Vert' ? '#22c55e'
                                  : order.couleur === 'Gris' ? '#9ca3af'
                                  : '#fff',
                              }}
                            />
                            <span className="font-semibold text-gray-800">{order.couleur}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100/50">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </div>
                      
                      <div className="flex-1" />

                      {(order.status === 'en_attente') && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="btn btn-error btn-sm btn-outline gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler
                        </button>
                      )}
                      
                      <button 
                        className="btn btn-ghost btn-sm gap-2"
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      >
                        {expandedOrderId === order.id ? 'Masquer détails' : 'Voir détails'}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Détails expandables */}
                {expandedOrderId === order.id && (
                  <div className="bg-gray-50/50 p-6 md:p-8 border-t border-gray-100 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Informations client
                        </h4>
                        <div className="space-y-2 text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <p><span className="font-medium text-gray-900">Nom:</span> {order.firstName} {order.lastName}</p>
                          <p><span className="font-medium text-gray-900">Tél:</span> {order.phone}</p>
                          <p><span className="font-medium text-gray-900">Adresse:</span> {order.address}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Historique
                        </h4>
                        <div className="space-y-2 text-gray-600 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <p><span className="font-medium text-gray-900">Commandé le:</span> {new Date(order.createdAt).toLocaleDateString()} à {new Date(order.createdAt).toLocaleTimeString()}</p>
                          <p><span className="font-medium text-gray-900">ID:</span> <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{order.id}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
