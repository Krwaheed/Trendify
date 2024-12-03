const Database = require('better-sqlite3');
const db = new Database('./database/identifier.sqlite', { verbose: console.log });

const schema = `
    CREATE TABLE IF NOT EXISTS categories (
                                              category_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              name TEXT NOT NULL,
                                              parent_id INTEGER,
                                              FOREIGN KEY (parent_id) REFERENCES categories(category_id)
        );

    CREATE TABLE IF NOT EXISTS products (
                                            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            name TEXT NOT NULL,
                                            description TEXT NOT NULL,
                                            image_url TEXT,
                                            price DECIMAL(10, 2) NOT NULL,
        category_id INTEGER NOT NULL,
        stock_quantity INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
        );

    CREATE TABLE IF NOT EXISTS carts (
                                         cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         status TEXT NOT NULL CHECK (status IN ('new', 'abandoned', 'purchased')),
        created_at DATETIME NOT NULL
        );

    CREATE TABLE IF NOT EXISTS cart_products (
                                                 cart_product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 cart_id INTEGER NOT NULL,
                                                 product_id INTEGER NOT NULL,
                                                 quantity INTEGER NOT NULL,
                                                 FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        );

    CREATE TABLE IF NOT EXISTS orders (
                                          order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          total_price DECIMAL(10, 2) NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'shipped', 'delivered')),
        created_at DATETIME NOT NULL
        );

    CREATE TABLE IF NOT EXISTS order_details (
                                                 order_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 order_id INTEGER NOT NULL,
                                                 product_id INTEGER NOT NULL,
                                                 quantity INTEGER NOT NULL,
                                                 FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        );
`;

db.exec(schema);
console.log("Database schema created successfully without users table.");
