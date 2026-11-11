-- schema.sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT
);

CREATE TABLE product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL, -- e.g., "1 lb", "2 lb", "Speed"
    price_cents INTEGER NOT NULL,
    stripe_price_id TEXT, -- Optional: if you prefer to use Stripe Price IDs
    FOREIGN KEY (product_id) REFERENCES products(id)
);