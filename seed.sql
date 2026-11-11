-- seed.sql

-- 1. Insert the main products
INSERT INTO products (name, slug, description) VALUES 
('Speed Jump Rope', 'speed-jump-rope', 'Red Surge Fitness Speed Jump Rope'),
('Weighted Jump Rope', 'weighted-jump-rope', 'Red Surge Fitness Weighted Jump Rope');

-- 2. Insert the variants (linking to the product IDs above, which are 1 and 2)
-- Note: price_cents is in cents, so $24.99 is 2499
INSERT INTO product_variants (product_id, name, price_cents, stripe_price_id) VALUES
(1, 'Standard', 2499, 'price_1UafYBHZMveWvgoKbgjT7UDm'),
(2, 'Standard', 2499, 'price_1UafYdHZMveWvgoKwMmJBC7W');