import { v4 as uuidv4 } from 'uuid';

// Base URL for images (set IMAGE_BASE_URL in env to point to frontend or CDN)
const IMG_BASE = (process.env.IMAGE_BASE_URL || '').replace(/\/$/, '');

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  favorites: number;
  favoritedBy: string[];
  createdAt: Date;
  ordersCount?: number;
  originalPrice?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
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
  createdAt: Date;
  updatedAt: Date;
}

const hoodieId = uuidv4();
const poloId = uuidv4();

export const products: Product[] = [
  {
    id: hoodieId,
    name: 'Hoodie Premium',
    category: 'Hoodie',
    price: 59.99,
    stock: 45,
    image: `${IMG_BASE ? IMG_BASE : ''}/hoodies.jpg`,
    favorites: 0,
    favoritedBy: [],
    createdAt: new Date(),
    ordersCount: 1,
    originalPrice: 89.99,
  },
  {
    id: poloId,
    name: 'Polo Bleu',
    category: 'Polo',
    price: 39.99,
    stock: 78,
    image: `${IMG_BASE ? IMG_BASE : ''}/polo.jpg`,
    favorites: 0,
    favoritedBy: [],
    createdAt: new Date(),
    ordersCount: 0,
  },
];

export const orders: Order[] = [
  {
    id: uuidv4(),
    userId: 'user_001',
    items: [
      {
        productId: hoodieId,
        name: 'Hoodie Premium',
        quantity: 1,
        price: 59.99,
      },
    ],
    totalAmount: 59.99,
    status: 'delivered',
    createdAt: new Date('2025-12-13'),
    updatedAt: new Date('2025-12-13'),
  },
];
