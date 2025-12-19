import { useAuthStore } from '../store/auth';
import { useOrderStore } from '../store/orders';
import type { Order, CheckoutData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useOrders() {
  const { user } = useAuthStore();
  const { orders, notifications, addOrderToStore, removeOrderFromStore } = useOrderStore();

  const addOrder = async (data: CheckoutData & { firstName: string, lastName: string, address: string, phone: string }) => {
    let createdId: string | null = null;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          items: [
            {
              productId: data.product.id,
              name: data.product.name,
              quantity: 1,
              price: data.product.price,
              size: data.taille,
              color: data.couleur,
            },
          ],
          totalAmount: data.product.price,
          shipping: {
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phone: data.phone,
          },
        }),
      });
      const created = await res.json();
      createdId = created?.id ?? null;
    } catch (e) {
      console.error('create failed', e);
    }

    const newOrder: Order = {
      id: createdId || uuidv4(),
      product: data.product,
      taille: data.taille,
      couleur: data.couleur,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phone: data.phone,
      status: 'en_attente',
      createdAt: new Date(),
    };

    addOrderToStore(newOrder);

    // Update LocalStorage
    const updatedOrders = useOrderStore.getState().orders;
    if (user?.uid) {
      localStorage.setItem(`orders:${user.uid}`, JSON.stringify(updatedOrders));
    }
    
    return newOrder;
  };

  const cancelOrder = async (orderId: string) => {
    removeOrderFromStore(orderId);
    
    const updatedOrders = useOrderStore.getState().orders;
    if (user?.uid) {
      localStorage.setItem(`orders:${user.uid}`, JSON.stringify(updatedOrders));
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.error('delete failed', e);
    }
  };

  return { orders, notifications, addOrder, cancelOrder };
}
