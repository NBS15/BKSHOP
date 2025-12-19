import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { products, Product } from '../data';

const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  res.json(products);
});

// GET product metrics (best products)
router.get('/metrics', (req, res) => {
  const sorted = [...products].sort((a, b) => {
    const ordersA = a.ordersCount || 0;
    const ordersB = b.ordersCount || 0;
    if (ordersB !== ordersA) return ordersB - ordersA;
    return (b.favorites || 0) - (a.favorites || 0);
  });
  res.json(sorted.slice(0, 6));
});

// GET sales products
router.get('/sales', (req, res) => {
  const salesProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
  res.json(salesProducts);
});

// GET products by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
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

  const newProduct: Product = {
    id: uuidv4(),
    name,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    image: image || '/product.jpg',
    favorites: 0,
    favoritedBy: [],
    ordersCount: 0,
    createdAt: new Date(),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// GET favorites for a user
router.get('/user/:userId/favorites', (req, res) => {
  const { userId } = req.params;
  // Find all products where favoritedBy includes userId
  const userFavorites = products
    .filter(p => p.favoritedBy && p.favoritedBy.includes(userId))
    .map(p => p.id);
  res.json(userFavorites);
});

// PUT update product
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, image, originalPrice } = req.body;

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
    ...(originalPrice !== undefined && { originalPrice: parseFloat(originalPrice) }),
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

// POST favorite product (increment favorites)
router.post('/:id/favorite', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const product = products[productIndex];
  if (!product.favoritedBy) product.favoritedBy = [];

  if (userId) {
    if (!product.favoritedBy.includes(userId)) {
      product.favoritedBy.push(userId);
      product.favorites = (product.favorites || 0) + 1;
    }
  } else {
    // Fallback for anonymous likes (optional, maybe disable?)
    product.favorites = (product.favorites || 0) + 1;
  }
  
  res.json(product);
});

// DELETE favorite product (decrement favorites)
router.delete('/:id/favorite', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const product = products[productIndex];
  if (!product.favoritedBy) product.favoritedBy = [];

  if (userId) {
    if (product.favoritedBy.includes(userId)) {
      product.favoritedBy = product.favoritedBy.filter(uid => uid !== userId);
      product.favorites = Math.max(0, (product.favorites || 0) - 1);
    }
  } else {
    // Fallback
    product.favorites = Math.max(0, (product.favorites || 0) - 1);
  }
  
  res.json(product);
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
