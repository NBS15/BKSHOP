import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { useOrderStore } from '../store/orders';
import type { Order, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface RemoteOrder {
  id: string;
  status: string;
  [key: string]: unknown;
}

export function useOrderPolling() {
  const { user } = useAuthStore();
  const { setOrders, addNotification } = useOrderStore();

  // Initial load
  useEffect(() => {
    const load = () => {
      if (user?.uid) {
        const raw = localStorage.getItem(`orders:${user.uid}`);
        try {
          const parsed: Order[] = raw ? JSON.parse(raw) : [];
          setOrders(parsed || []);
        } catch (e) {
          console.error('Failed to parse orders from local storage', e);
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    };
    load();
  }, [user?.uid, setOrders]);

  // Polling
  useEffect(() => {
    if (!user?.uid) return;

    const mapStatus = (s: string): Order['status'] => {
      if (s === 'delivered') return 'livre';
      if (s === 'shipped') return 'pret';
      if (s === 'cancelled') return 'annule';
      if (s === 'processing') return 'en_preparation';
      return 'en_attente';
    };

    const tick = async () => {
      try {
        const currentOrders = useOrderStore.getState().orders;
        if (currentOrders.length === 0) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/orders/user/${user.uid}`);
        
        if (res.ok) {
          const remoteOrders: RemoteOrder[] = await res.json();
          let changed = false;
          const updatedOrders = currentOrders.map(localOrder => {
            const remote = remoteOrders.find((r) => r.id === localOrder.id);
            if (!remote) return localOrder;

            const newStatus = mapStatus(remote.status);
            if (newStatus !== localOrder.status) {
              changed = true;
              const notification: Notification = {
                id: uuidv4(),
                type: newStatus,
                productName: localOrder.product.name,
                message: `Statut mis à jour: ${newStatus.replace('_', ' ')}`,
                timestamp: new Date()
              };
              addNotification(notification);
              return { ...localOrder, status: newStatus };
            }
            return localOrder;
          });

          if (changed) {
            setOrders(updatedOrders);
            localStorage.setItem(`orders:${user.uid}`, JSON.stringify(updatedOrders));
          }
        }
      } catch (e) {
        console.error('Polling sync failed', e);
      }
    };

    const interval = setInterval(tick, 5000);
    return () => clearInterval(interval);
  }, [user?.uid, addNotification, setOrders]);
}
