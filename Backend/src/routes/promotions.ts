import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

interface Promotion {
  id: string;
  code: string;
  name: string;
  discount: number;
  type: 'percentage' | 'fixed';
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt: Date;
}

// Mock database
let promotions: Promotion[] = [
  {
    id: uuidv4(),
    code: 'WELCOME20',
    name: 'Bienvenue 20%',
    discount: 20,
    type: 'percentage',
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-31'),
    active: true,
    createdAt: new Date(),
  },
];

// GET all promotions
router.get('/', (req, res) => {
  res.json(promotions);
});

// GET active promotions
router.get('/active', (req, res) => {
  const now = new Date();
  const activePromos = promotions.filter(
    (p) => p.active && p.startDate <= now && p.endDate >= now
  );
  res.json(activePromos);
});

// GET promotion by code
router.get('/code/:code', (req, res) => {
  const promotion = promotions.find(
    (p) => p.code.toUpperCase() === req.params.code.toUpperCase()
  );
  if (!promotion) {
    return res.status(404).json({ error: 'Promotion not found' });
  }
  res.json(promotion);
});

// POST new promotion
router.post('/', (req, res) => {
  const { code, name, discount, type, startDate, endDate } = req.body;

  if (!code || !name || !discount || !type || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newPromotion: Promotion = {
    id: uuidv4(),
    code: code.toUpperCase(),
    name,
    discount: parseFloat(discount),
    type,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    active: true,
    createdAt: new Date(),
  };

  promotions.push(newPromotion);
  res.status(201).json(newPromotion);
});

// PUT update promotion
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { code, name, discount, type, startDate, endDate, active } = req.body;

  const promoIndex = promotions.findIndex((p) => p.id === id);
  if (promoIndex === -1) {
    return res.status(404).json({ error: 'Promotion not found' });
  }

  const updatedPromo = {
    ...promotions[promoIndex],
    ...(code && { code: code.toUpperCase() }),
    ...(name && { name }),
    ...(discount && { discount: parseFloat(discount) }),
    ...(type && { type }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
    ...(active !== undefined && { active }),
  };

  promotions[promoIndex] = updatedPromo;
  res.json(updatedPromo);
});

// DELETE promotion
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const promoIndex = promotions.findIndex((p) => p.id === id);

  if (promoIndex === -1) {
    return res.status(404).json({ error: 'Promotion not found' });
  }

  const deletedPromo = promotions.splice(promoIndex, 1);
  res.json(deletedPromo[0]);
});

export default router;
