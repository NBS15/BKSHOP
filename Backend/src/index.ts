import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import promotionRoutes from './routes/promotions.js';
import orderRoutes from './routes/orders.js';
import messageRoutes from './routes/messages.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown handlers
function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed. Exiting.');
    process.exit(0);
  });

  // Force exit after timeout
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully exiting');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
