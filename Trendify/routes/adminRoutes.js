const express = require('express');
const multer = require('multer');
const fs = require('fs');
const Database = require('better-sqlite3');
const router = express.Router();

// Database connection
const db = new Database('./database/identifier.sqlite', { verbose: console.log });


const upload = multer({ dest: 'uploads/' });

/**
 * Update a single product by product_id
 */
router.put('/products/:product_id', (req, res) => {
    const { product_id } = req.params;
    const { name, description, price, stock_quantity, image_url, category_id } = req.body;

    if (!name || !description || price == null || stock_quantity == null || !image_url || category_id == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        UPDATE products
        SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ?, category_id = ?
        WHERE product_id = ?
    `;

    try {
        const result = db.prepare(query).run(name, description, price, stock_quantity, image_url, category_id, product_id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', changes: result.changes });
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).json({ error: 'Failed to update product', details: err.message });
    }
});

/**
 * Bulk upload products
 */
router.post('/upload', upload.single('fileUpload'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Process the uploaded file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read uploaded file' });
        }

        try {

            const lines = data.split('\n').filter(line => line.trim() !== '');
            const products = lines.map(line => {
                const parts = line.split(', ').reduce((acc, part) => {
                    const [key, value] = part.split(': ');
                    acc[key.trim()] = value.replace(/"/g, '').trim();
                    return acc;
                }, {});
                return {
                    name: parts.name,
                    description: parts.description,
                    image_url: parts.image_url,
                    price: parseFloat(parts.price),
                    category_id: parseInt(parts.category_id),
                    stock_quantity: parseInt(parts.stock_quantity),
                    is_featured: parts.is_featured === 'true',
                };
            });

            // Insert products into the database
            const stmt = db.prepare(`
                INSERT INTO products (name, description, image_url, price, category_id, stock_quantity, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            products.forEach(product => {
                stmt.run(
                    product.name,
                    product.description,
                    product.image_url,
                    product.price,
                    product.category_id,
                    product.stock_quantity,
                    product.is_featured
                );
            });

            res.status(200).json({ message: 'File uploaded and products added successfully', products });
        } catch (error) {
            console.error('Error processing file:', error);
            res.status(500).json({ error: 'Failed to process uploaded file' });
        } finally {
            fs.unlink(filePath, () => {});
        }
    });
});


/**
 * Handle unknown routes
 */
router.all('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = router;
