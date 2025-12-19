import { useState, useEffect } from 'react';

interface Promotion {
  id: number;
  code: string;
  name: string;
  discount: number;
  type: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  active: boolean;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  originalPrice?: number;
}

export default function Promotions() {
  const [activeTab, setActiveTab] = useState<'codes' | 'sales'>('sales');
  
  // --- Promotion Codes Logic ---
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 1,
      code: 'WELCOME20',
      name: 'Bienvenue 20%',
      discount: 20,
      type: 'percentage',
      startDate: '2025-12-01',
      endDate: '2025-12-31',
      active: true,
    },
    {
      id: 2,
      code: 'NOEL50',
      name: 'Noël -50€',
      discount: 50,
      type: 'fixed',
      startDate: '2025-12-15',
      endDate: '2025-12-25',
      active: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'fixed',
    startDate: '',
    endDate: '',
  });

  const handleAddPromotion = () => {
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      discount: '',
      type: 'percentage',
      startDate: '',
      endDate: '',
    });
    setShowModal(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingId(promotion.id);
    setFormData({
      code: promotion.code,
      name: promotion.name,
      discount: promotion.discount.toString(),
      type: promotion.type,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      active: promotion.active,
    } as any);
    setShowModal(true);
  };

  const handleSavePromotion = () => {
    if (!formData.code || !formData.name || !formData.discount || !formData.startDate || !formData.endDate) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (editingId) {
      setPromotions(promotions.map(p => p.id === editingId ? {
        ...p,
        code: formData.code.toUpperCase(),
        name: formData.name,
        discount: parseFloat(formData.discount),
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
      } : p));
    } else {
      const newPromotion: Promotion = {
        id: Math.max(...promotions.map(p => p.id), 0) + 1,
        code: formData.code.toUpperCase(),
        name: formData.name,
        discount: parseFloat(formData.discount),
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: true,
      };
      setPromotions([...promotions, newPromotion]);
    }
    setShowModal(false);
  };

  const handleDeletePromotion = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  const handleTogglePromotion = (id: number) => {
    setPromotions(promotions.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  // --- Sales (Soldes) Logic ---
  const [products, setProducts] = useState<Product[]>([]);
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [salesFormData, setSalesFormData] = useState({
    originalPrice: '',
    newPrice: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error('Failed to fetch products', e);
    }
  };

  const handleAddSale = () => {
    setSelectedProductId('');
    setSalesFormData({ originalPrice: '', newPrice: '' });
    setShowSalesModal(true);
  };

  const handleEditSale = (product: Product) => {
    setSelectedProductId(product.id);
    setSalesFormData({
      originalPrice: product.originalPrice?.toString() || product.price.toString(),
      newPrice: product.price.toString(),
    });
    setShowSalesModal(true);
  };

  const handleSaveSale = async () => {
    if (!selectedProductId || !salesFormData.originalPrice || !salesFormData.newPrice) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    try {
      const updatedProduct = {
        ...product,
        originalPrice: parseFloat(salesFormData.originalPrice),
        price: parseFloat(salesFormData.newPrice),
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${selectedProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        fetchProducts();
        setShowSalesModal(false);
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleRemoveSale = async (product: Product) => {
    if (confirm(`Retirer ${product.name} des soldes ? (Le prix reviendra au prix d'origine)`)) {
      try {
        const originalPrice = product.originalPrice || product.price;
        const updatedProduct = {
          ...product,
          price: originalPrice,
          originalPrice: undefined, // Remove originalPrice
        };

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });

        if (res.ok) {
          fetchProducts();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const salesProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">🏷️ Promotions & Soldes</h1>
      </div>

      <div className="tabs tabs-boxed">
        <a className={`tab ${activeTab === 'sales' ? 'tab-active' : ''}`} onClick={() => setActiveTab('sales')}>Soldes Produits</a>
        <a className={`tab ${activeTab === 'codes' ? 'tab-active' : ''}`} onClick={() => setActiveTab('codes')}>Codes Promo</a>
      </div>

      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={handleAddSale}>
              ➕ Mettre un produit en solde
            </button>
          </div>

          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl">🔥 Produits en Solde</h2>
              {salesProducts.length === 0 ? (
                <p className="text-base-content/60">Aucun produit en solde actuellement.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Ancien Prix</th>
                        <th>Nouveau Prix</th>
                        <th>Réduction</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesProducts.map(product => {
                        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
                        return (
                          <tr key={product.id}>
                            <td className="font-bold">
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12">
                                    <img src={product.image} alt={product.name} />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold">{product.name}</div>
                                  <div className="text-sm opacity-50">{product.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="line-through text-error">{product.originalPrice}€</td>
                            <td className="font-bold text-success">{product.price}€</td>
                            <td><span className="badge badge-error text-white">-{discount}%</span></td>
                            <td>
                              <div className="flex gap-2">
                                <button className="btn btn-sm btn-ghost" onClick={() => handleEditSale(product)}>✏️ Modifier</button>
                                <button className="btn btn-sm btn-outline btn-error" onClick={() => handleRemoveSale(product)}>Retirer</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'codes' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={handleAddPromotion}>
              ➕ Créer un Code Promo
            </button>
          </div>
          
          {/* Existing Promotions UI... */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-2xl">📋 Liste des Codes Promo</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Nom</th>
                      <th>Réduction</th>
                      <th>Statut</th>
                      <th>Fin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map((promo) => (
                      <tr key={promo.id}>
                        <td className="font-mono font-bold">{promo.code}</td>
                        <td>{promo.name}</td>
                        <td>
                          {promo.discount}
                          {promo.type === 'percentage' ? '%' : '€'}
                        </td>
                        <td>
                          <div className="form-control">
                            <label className="cursor-pointer label">
                              <input
                                type="checkbox"
                                className="toggle toggle-success toggle-sm"
                                checked={promo.active}
                                onChange={() => handleTogglePromotion(promo.id)}
                              />
                            </label>
                          </div>
                        </td>
                        <td>{promo.endDate}</td>
                        <td className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleEditPromotion(promo)}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-ghost text-error"
                            onClick={() => handleDeletePromotion(promo.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Promo Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {editingId ? 'Modifier le Code Promo' : 'Nouveau Code Promo'}
            </h3>
            <div className="form-control w-full mt-4">
              <label className="label"><span className="label-text">Code</span></label>
              <input type="text" className="input input-bordered w-full" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Nom</span></label>
              <input type="text" className="input input-bordered w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Réduction</span></label>
                <input type="number" className="input input-bordered w-full" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
              </div>
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Type</span></label>
                <select className="select select-bordered w-full" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Montant fixe (€)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Début</span></label>
                <input type="date" className="input input-bordered w-full" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="form-control w-1/2">
                <label className="label"><span className="label-text">Fin</span></label>
                <input type="date" className="input input-bordered w-full" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSavePromotion}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Modal */}
      {showSalesModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Mettre un produit en solde</h3>
            
            <div className="form-control w-full mt-4">
              <label className="label"><span className="label-text">Produit</span></label>
              <select 
                className="select select-bordered w-full" 
                value={selectedProductId} 
                onChange={e => {
                  const pid = e.target.value;
                  setSelectedProductId(pid);
                  const p = products.find(prod => prod.id === pid);
                  if (p) {
                    setSalesFormData({
                      originalPrice: p.price.toString(),
                      newPrice: (p.price * 0.8).toFixed(2), // Default 20% off suggestion
                    });
                  }
                }}
                disabled={!!products.find(p => p.id === selectedProductId && p.originalPrice && p.originalPrice > p.price)}
              >
                <option value="" disabled>Choisir un produit</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.price}€</option>
                ))}
              </select>
            </div>

            <div className="form-control w-full mt-4">
              <label className="label"><span className="label-text">Prix avant solde (Ancien prix)</span></label>
              <input 
                type="number" 
                step="0.01" 
                className="input input-bordered w-full" 
                value={salesFormData.originalPrice} 
                onChange={e => setSalesFormData({...salesFormData, originalPrice: e.target.value})} 
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label"><span className="label-text">Prix soldé (Nouveau prix)</span></label>
              <input 
                type="number" 
                step="0.01" 
                className="input input-bordered w-full" 
                value={salesFormData.newPrice} 
                onChange={e => setSalesFormData({...salesFormData, newPrice: e.target.value})} 
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowSalesModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSaveSale}>Sauvegarder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
