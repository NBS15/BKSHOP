import { create } from 'zustand';
import type { Order, Notification } from '../types';

interface OrderState {
  orders: Order[];
  notifications: Notification[];
  setOrders: (orders: Order[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  addOrderToStore: (order: Order) => void;
  removeOrderFromStore: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  notifications: [],
  setOrders: (orders) => set({ orders }),
  addNotification: (notification) => {
    set((state) => ({ notifications: [notification, ...state.notifications].slice(0, 20) }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notification.id),
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
  addOrderToStore: (order) => set((state) => ({ orders: [...state.orders, order] })),
  removeOrderFromStore: (id) => set((state) => ({ orders: state.orders.filter((o) => o.id !== id) })),
}));
