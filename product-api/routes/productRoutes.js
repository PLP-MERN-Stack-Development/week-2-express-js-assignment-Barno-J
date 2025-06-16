const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validateProduct } = require('../middleware/validationMiddleware');
const { NotFoundError, ValidationError } = require('../errors/customErrors');

let products = [
    {
        id: '1',
        name: 'Laptop',
        description: 'High-performance laptop with 16GB RAM',
        price: 1200,
        category: 'electronics',
        inStock: true
    },
    {
        id: '2',
        name: 'Smartphone',
        description: 'Latest model with 128GB storage',
        price: 800,
        category: 'electronics',
        inStock: true
    },
    {
        id: '3',
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with timer',
        price: 50,
        category: 'kitchen',
        inStock: false
    }
];

router.get('/', (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    let filteredProducts = products;

    if (category) {
        filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
        total: filteredProducts.length,
        page: parseInt(page),
        limit: parseInt(limit),
        products: paginatedProducts
    });
});

router.get('/:id', (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return next(new NotFoundError('Product not found'));
    }
    res.json(product);
});

router.post('/', authMiddleware, validateProduct, (req, res) => {
    const product = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    products.push(product);
    res.status(201).json(product);
});

router.put('/:id', authMiddleware, validateProduct, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return next(new NotFoundError('Product not found'));
    }
    products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
    res.json(products[index]);
});

router.delete('/:id', authMiddleware, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return next(new NotFoundError('Product not found'));
    }
    const deleted = products.splice(index, 1);
    res.json(deleted[0]);
});

router.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json(products);
    }
    const searchResults = products.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase())
    );
    res.json(searchResults);
});

router.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json(products);
    }
    const searchResults = products.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase())
    );
    res.json(searchResults);
});

router.get('/stats', (req, res) => {
    const stats = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});
    res.json({
        totalProducts: products.length,
        categories: stats
    });
});

module.exports = router;