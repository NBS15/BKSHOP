import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
// Mock database
let orders = [
    {
        id: uuidv4(),
        userId: 'user_001',
        items: [
            {
                productId: 'prod_001',
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
// GET all orders
router.get('/', (req, res) => {
    res.json(orders);
});
// GET orders by user
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const userOrders = orders.filter((o) => o.userId === userId);
    res.json(userOrders);
});
// GET single order
router.get('/:id', (req, res) => {
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
});
// POST new order
router.post('/', (req, res) => {
    const { userId, items, totalAmount, promotionCode, shipping } = req.body;
    if (!userId || !items || !totalAmount) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newOrder = {
        id: uuidv4(),
        userId,
        items,
        totalAmount,
        status: 'pending',
        ...(promotionCode && { promotionCode }),
        ...(shipping && { shipping }),
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});
// PUT update order status
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    if (status && !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const updatedOrder = {
        ...orders[orderIndex],
        ...(status && { status }),
        updatedAt: new Date(),
    };
    orders[orderIndex] = updatedOrder;
    res.json(updatedOrder);
});
// DELETE order
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    const deletedOrder = orders.splice(orderIndex, 1);
    res.json(deletedOrder[0]);
});
export default router;
//# sourceMappingURL=orders.js.map