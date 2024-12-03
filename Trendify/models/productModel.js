const Database = require('better-sqlite3');
const db = new Database('./database/identifier.sqlite');

exports.getAllProducts = () => {
    const stmt = db.prepare('SELECT * FROM products');
    return stmt.all();
};

exports.getProductById = (id) => {
    const stmt = db.prepare('SELECT * FROM products WHERE product_id = ?');
    return stmt.get(id);
};

exports.createProduct = (product) => {
    const stmt = db.prepare('INSERT INTO products (name, description, image_url, price, category_id, stock_quantity, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(product.name, product.description, product.image_url, product.price, product.category_id, product.stock_quantity, product.is_featured);
};

exports.updateProduct = (id, product) => {
    if (!id || !product) {
        throw new Error('Missing product ID or product data');
    }

    const stmt = db.prepare(`
        UPDATE products
        SET name = ?, description = ?, image_url = ?, price = ?, category_id = ?, stock_quantity = ?, is_featured = ?
        WHERE product_id = ?
    `);

    const result = stmt.run(
        product.name,
        product.description,
        product.image_url,
        product.price,
        product.category_id,
        product.stock_quantity,
        product.is_featured,
        id
    );

    if (result.changes === 0) {
        throw new Error('No product found with the provided ID');
    }

    return result;
};

exports.deleteProduct = (id) => {
    const stmt = db.prepare('DELETE FROM products WHERE product_id = ?');
    stmt.run(id);
};
