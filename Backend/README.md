# BK Shop Backend

API Backend pour BK Shop avec Express et TypeScript.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le serveur tournera sur `http://localhost:5000`

## Build

```bash
npm run build
npm start
```

## API Endpoints

### Produits
- `GET /api/products` - Tous les produits
- `GET /api/products/:id` - Un produit
- `GET /api/products/category/:category` - Produits par catégorie
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Promotions
- `GET /api/promotions` - Toutes les promotions
- `GET /api/promotions/active` - Promotions actives
- `GET /api/promotions/code/:code` - Promotion par code
- `POST /api/promotions` - Créer une promotion
- `PUT /api/promotions/:id` - Modifier une promotion
- `DELETE /api/promotions/:id` - Supprimer une promotion

### Commandes
- `GET /api/orders` - Toutes les commandes
- `GET /api/orders/:id` - Une commande
- `GET /api/orders/user/:userId` - Commandes d'un utilisateur
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Modifier le statut d'une commande
- `DELETE /api/orders/:id` - Supprimer une commande
