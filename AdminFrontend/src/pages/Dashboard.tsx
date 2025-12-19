import { useEffect, useState } from 'react';

interface Statistic {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  promotionCode?: string;
  shipping?: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  favorites: number;
  createdAt: string | Date;
}

export default function Dashboard() {
  const [stats] = useState<Statistic[]>([
    {
      title: 'Produits',
      value: 145,
      icon: '📦',
      color: 'bg-blue-500',
    },
    {
      title: 'Commandes',
      value: 1250,
      icon: '🛒',
      color: 'bg-green-500',
    },
    {
      title: 'Revenus',
      value: '45.200€',
      icon: '💰',
      color: 'bg-yellow-500',
    },
    {
      title: 'Clients',
      value: 850,
      icon: '👥',
      color: 'bg-purple-500',
    },
  ]);

  const [topProducts, setTopProducts] = useState<Array<{ name: string; orders: number; favorites: number }>>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/orders`),
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        ]);
        const data: Order[] = await ordersRes.json();
        const prods: Product[] = await productsRes.json();
        setProducts(prods);
        const sorted = data.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
        setOrders(sorted);
        const counts: Record<string, number> = {};
        sorted.forEach((o) => o.items.forEach((it) => (counts[it.productId] = (counts[it.productId] || 0) + it.quantity)));
        const tops = prods
          .map((p) => ({ name: p.name, orders: counts[p.id] || 0, favorites: p.favorites || 0 }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 4);
        setTopProducts(tops);
      } catch (e) {
        console.error('Failed to fetch orders', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const tick = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/orders`),
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
        ]);
        const data: Order[] = await ordersRes.json();
        const prods: Product[] = await productsRes.json();
        setProducts(prods);
        const sorted = data.sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());
        setOrders(sorted);
        const counts: Record<string, number> = {};
        sorted.forEach((o) => o.items.forEach((it) => (counts[it.productId] = (counts[it.productId] || 0) + it.quantity)));
        const tops = prods
          .map((p) => ({ name: p.name, orders: counts[p.id] || 0, favorites: p.favorites || 0 }))
          .sort((a, b) => b.orders - a.orders)
          .slice(0, 4);
        setTopProducts(tops);
      } catch (e) {
        console.error('Failed to refresh orders', e);
      }
    };
    const timer = setInterval(tick, 5000);
    return () => clearInterval(timer);
  }, []);

  const updateOrderStatus = async (id: string, newStatus: Order['status']) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
    } catch (e) {
      console.error('Failed to update order status', e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold">Tableau de Bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base-content/60 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produits les Plus Commandés */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl">🏆 Produits les Plus Commandés</h2>
            <div className="space-y-3 mt-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <div className="text-sm text-base-content/60">
                      {product.orders} commandes • {product.favorites} ❤️
                    </div>
                  </div>
                  <div className="badge badge-primary">{product.orders}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commandes Récentes */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-2xl">📋 Commandes Récentes</h2>
            <div className="overflow-x-auto mt-4">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-base-200 cursor-pointer" onClick={() => setSelected(order)}>
                      <td className="font-mono">{order.id.slice(0, 8)}</td>
                      <td>{order.shipping ? `${order.shipping.firstName} ${order.shipping.lastName}` : order.userId}</td>
                      <td className="font-bold">{order.totalAmount.toFixed(2)}€</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === 'delivered'
                              ? 'badge-success'
                              : order.status === 'processing'
                                ? 'badge-info'
                                : order.status === 'shipped'
                                  ? 'badge-primary'
                                  : order.status === 'cancelled'
                                    ? 'badge-error'
                                    : 'badge-warning'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-2xl shadow-2xl max-w-3xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Détails de la commande</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2">Client</p>
                <p>{selected.shipping ? `${selected.shipping.firstName} ${selected.shipping.lastName}` : selected.userId}</p>
                {selected.shipping && (
                  <>
                    <p className="text-sm text-base-content/70 mt-2">{selected.shipping.address}</p>
                    <p className="text-sm text-base-content/70">{selected.shipping.phone}</p>
                  </>
                )}
                <div className="mt-4">
                  <p className="font-semibold mb-2">Informations</p>
                  <p><span className="text-base-content/70">ID:</span> {selected.id}</p>
                  <p><span className="text-base-content/70">Statut:</span> {selected.status}</p>
                  <p><span className="text-base-content/70">Créée le:</span> {new Date(selected.createdAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">Articles</p>
                <div className="space-y-2">
                  {selected.items.map((it, idx) => (
                    <div key={idx} className="p-3 bg-base-200 rounded-lg">
                      <div className="flex justify-between">
                        <span>{it.name}</span>
                        <span className="font-mono">{(it.price * it.quantity).toFixed(2)}€</span>
                      </div>
                      <div className="text-sm text-base-content/70">
                        Qté: {it.quantity}
                        {it.size && <> • Taille: {it.size}</>}
                        {it.color && <> • Couleur: {it.color}</>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary text-primary-content rounded-lg flex justify-between">
                  <span>Total</span>
                  <span className="font-bold">{selected.totalAmount.toFixed(2)}€</span>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2">Statut de la commande</label>
                  <select
                    className="select select-bordered w-full"
                    value={selected.status}
                    onChange={(e) => updateOrderStatus(selected.id, e.target.value as Order['status'])}
                  >
                    <option value="pending">En attente</option>
                    <option value="processing">En cours</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
