import { v4 as uuidv4 } from 'uuid';
const hoodieId = uuidv4();
const poloId = uuidv4();
export const products = [
    {
        id: hoodieId,
        name: 'Hoodie Premium',
        category: 'Hoodie',
        price: 59.99,
        stock: 45,
        image: '/hoodies.jpg',
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
        image: '/polo.jpg',
        favorites: 0,
        favoritedBy: [],
        createdAt: new Date(),
        ordersCount: 0,
    },
];
export const orders = [
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
//# sourceMappingURL=data.js.map