import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const categories = ['Hoodie', 'Polo', 'T-shirt', 'Casquette'];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    price: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      if (!response.ok) throw new Error('Erreur');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData({ name: '', category: categories[0], price: '', stock: '' });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setSelectedFile(null);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      let imageData = '/product.jpg';

      // Convertir l'image en base64 si un fichier est sélectionné
      if (selectedFile) {
        imageData = await fileToBase64(selectedFile);
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: imageData,
      };

      if (editingId) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Erreur');
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Erreur');
      }

      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE',
      })
        .then(() => fetchProducts())
        .catch((err) => console.error('Erreur:', err));
    }
  };

  const handlePriceChange = async (id: string, newPrice: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          price: newPrice,
        }),
      });
      if (!response.ok) throw new Error('Erreur');
      fetchProducts();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">📦 Gestion des Produits</h1>
        <button
          className="btn btn-primary"
          onClick={handleAddProduct}
        >
          ➕ Ajouter un Produit
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.category === category);
          return (
            <div key={category} className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <h2 className="card-title text-xl">{category}</h2>
                {categoryProducts.length === 0 ? (
                  <p className="text-base-content/60">Aucun produit dans cette catégorie</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Prix</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="font-semibold">{product.name}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  className="input input-bordered input-sm w-24"
                                  value={product.price}
                                  onChange={(e) =>
                                    handlePriceChange(product.id, parseFloat(e.target.value))
                                  }
                                  step="0.01"
                                />
                                €
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-outline">{product.stock}</span>
                            </td>
                            <td className="flex gap-2">
                              <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => handleEditProduct(product)}
                              >
                                ✏️ Modifier
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                🗑️ Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-md">
            <h3 className="font-bold text-lg">
              {editingId ? '✏️ Modifier le Produit' : '➕ Ajouter un Produit'}
            </h3>
            <div className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Nom du produit"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <select
                className="select select-bordered w-full"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Prix (€)"
                className="input input-bordered w-full"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                step="0.01"
              />
              <input
                type="number"
                placeholder="Stock"
                className="input input-bordered w-full"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
              />
              <div className="form-control">
                <label className="label">
                  <span className="label-text">📸 Photo du produit</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <p className="text-sm text-success mt-2">
                    ✓ {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveProduct}
              >
                Enregistrer
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          />
        </div>
      )}
    </div>
  );
}
