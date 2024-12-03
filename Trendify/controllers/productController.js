const productModel = require('../models/productModel');

exports.getAllProducts = (req, res) => {
    try {
        const products = productModel.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = (req, res) => {
    try {
        const product = productModel.getProductById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProduct = (req, res) => {
    try {
        productModel.createProduct(req.body);
        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = (req, res) => {
    try {
        productModel.updateProduct(req.params.id, req.body);
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = (req, res) => {
    try {
        productModel.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
