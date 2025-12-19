import express from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();
// Mock database
let products = [
    {
        id: uuidv4(),
        name: 'Hoodie Premium',
        category: 'Hoodie',
        price: 59.99,
        stock: 45,
        image: '/hoodies.jpg',
        createdAt: new Date(),
    },
    {
        id: uuidv4(),
        name: 'Polo Bleu',
        category: 'Polo',
        price: 39.99,
        stock: 78,
        image: '/polo.jpg',
        createdAt: new Date(),
    },
];
// GET all products
router.get('/', (req, res) => {
    res.json(products);
});
// GET products by category
router.get('/category/:category', (req, res) => {
    const { category } = req.params;
    const categoryProducts = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    res.json(categoryProducts);
});
// GET single product
router.get('/:id', (req, res) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});
// POST new product
router.post('/', (req, res) => {
    const { name, category, price, stock, image } = req.body;
    if (!name || !category || !price || !stock) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newProduct = {
        id: uuidv4(),
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        image: image || '/product.jpg',
        createdAt: new Date(),
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
// PUT update product
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, price, stock, image } = req.body;
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const updatedProduct = {
        ...products[productIndex],
        ...(name && { name }),
        ...(category && { category }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(image && { image }),
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});
// DELETE product
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct[0]);
});
export default router;
//# sourceMappingURL=products.js.map