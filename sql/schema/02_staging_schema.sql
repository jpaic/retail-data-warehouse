-- STAGING LAYER SCHEMA
-- Cleaned, typed version of RAW data structure

CREATE TABLE staging.orders_clean (
    order_id TEXT,
    order_date DATE,
    ship_date DATE,
    ship_mode TEXT,
    customer_name TEXT,
    segment TEXT,
    state TEXT,
    country TEXT,
    market TEXT,
    region TEXT,
    product_id TEXT,
    category TEXT,
    sub_category TEXT,
    product_name TEXT,
    sales NUMERIC,
    quantity INTEGER,
    discount NUMERIC,
    profit NUMERIC,
    shipping_cost NUMERIC,
    order_priority TEXT,
    year INTEGER
);