export type OrderStatus = 'en_attente' | 'en_preparation' | 'pret' | 'livre' | 'annule';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  favorites?: number;
  originalPrice?: number;
}

export interface Order {
  id: string;
  product: Product;
  taille: string;
  couleur: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  status: OrderStatus;
  createdAt: Date; // Note: When parsing from JSON, this might be a string
}

export interface CheckoutData {
  product: Product;
  taille: string;
  couleur: string;
}

export interface Notification {
  id: string;
  type: OrderStatus;
  productName: string;
  message: string;
  timestamp: Date;
}
