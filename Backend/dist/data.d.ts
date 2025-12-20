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
export declare const products: Product[];
export declare const orders: Order[];
//# sourceMappingURL=data.d.ts.map