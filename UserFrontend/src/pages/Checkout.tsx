import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { product, taille, couleur } = state || {};
  const { addOrder } = useOrders();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSize, setSelectedSize] = useState<string>(taille ?? 'M');
  const [selectedColor, setSelectedColor] = useState<string>(couleur ?? 'Noir');

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!address.trim()) newErrors.address = "L'adresse est requise";
    if (!phone.trim()) newErrors.phone = 'Le numéro de téléphone est requis';
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Le numéro doit contenir 10 chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await addOrder({
        product,
        taille: selectedSize,
        couleur: selectedColor,
        firstName,
        lastName,
        address,
        phone,
      });
      navigate('/cart');
    }
  };

  return (
    <>
      <SEO title="Paiement" description="Finalisez votre commande." />
      <div className="container mx-auto max-w-5xl px-4 py-8 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8 font-medium"
        >
          <span className="p-2 rounded-full bg-white/50 group-hover:bg-primary/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </span>
          Retour à la boutique
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Résumé du produit */}
          <div className="glass-effect rounded-3xl p-6 md:p-8 md:sticky md:top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Résumé de la commande</h2>
            </div>
            
            <figure className="w-full aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center mb-6 shadow-inner group relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent opacity-50" />
              <img
                src={product.image}
                alt={product.name}
                className="w-3/4 h-3/4 object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500"
              />
            </figure>

            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{product.category}</p>
                </div>
                <span className="text-xl font-bold text-primary">{product.price}€</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="bg-white/50 rounded-xl p-3 border border-white/50">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-2">Taille</span>
                  <div className="flex gap-2 flex-wrap">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`btn btn-xs md:btn-sm ${selectedSize === size ? 'btn-primary' : 'btn-outline'}`}
                        aria-pressed={selectedSize === size}
                        aria-label={`Choisir taille ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white/50 rounded-xl p-3 border border-white/50">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-2">Couleur</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {['Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Gris'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full transition-all hover:scale-110 focus:scale-105"
                        aria-pressed={selectedColor === c}
                        aria-label={`Choisir couleur ${c}`}
                        style={{
                          backgroundColor:
                            c === 'Noir' ? '#000'
                            : c === 'Blanc' ? '#fff'
                            : c === 'Bleu' ? '#3b82f6'
                            : c === 'Rouge' ? '#ef4444'
                            : c === 'Vert' ? '#22c55e'
                            : c === 'Gris' ? '#9ca3af'
                            : '#fff',
                          border: selectedColor === c ? '3px solid #6366f1' : '1px solid #ccc',
                          boxShadow: selectedColor === c ? '0 0 8px rgba(99, 102, 241, 0.5)' : 'none'
                        }}
                      />
                    ))}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                        style={{
                          backgroundColor:
                            selectedColor === 'Noir' ? '#000'
                            : selectedColor === 'Blanc' ? '#fff'
                            : selectedColor === 'Bleu' ? '#3b82f6'
                            : selectedColor === 'Rouge' ? '#ef4444'
                            : selectedColor === 'Vert' ? '#22c55e'
                            : selectedColor === 'Gris' ? '#9ca3af'
                            : '#fff',
                        }}
                      />
                      <span className="font-semibold text-gray-800">{selectedColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mt-4">
                <div className="flex justify-between text-lg font-bold items-center">
                  <span className="text-gray-700">Total à payer</span>
                  <span className="text-2xl text-primary">{product.price}€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="glass-effect rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Livraison</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Prénom</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`input input-bordered w-full bg-white/50 focus:bg-white focus:input-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-gray-900 placeholder:text-gray-500 ${
                      errors.firstName ? 'input-error' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <label className="label">
                      <span className="label-text-alt text-error font-medium">{errors.firstName}</span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Nom</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`input input-bordered w-full bg-white/50 focus:bg-white focus:input-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-gray-900 placeholder:text-gray-500 ${
                      errors.lastName ? 'input-error' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <label className="label">
                      <span className="label-text-alt text-error font-medium">{errors.lastName}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Adresse de livraison</span>
                </label>
                  <input
                    type="text"
                    placeholder="Numéro et nom de rue, Ville, Code postal"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`input input-bordered w-full bg-white/50 focus:bg-white focus:input-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-gray-900 placeholder:text-gray-500 ${
                      errors.address ? 'input-error' : ''
                    }`}
                  />
                {errors.address && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">{errors.address}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Téléphone</span>
                </label>
                  <input
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`input input-bordered w-full bg-white/50 focus:bg-white focus:input-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 text-gray-900 placeholder:text-gray-500 ${
                      errors.phone ? 'input-error' : ''
                    }`}
                  />
                {errors.phone && (
                  <label className="label">
                    <span className="label-text-alt text-error font-medium">{errors.phone}</span>
                  </label>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full btn-lg rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
                >
                  Confirmer la commande
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
