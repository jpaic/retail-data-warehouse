-- RAW LAYER: Data ingested as-is from CSV source
-- No transformations applied
-- All fields stored as TEXT for schema flexibility

CREATE TABLE raw.orders (
    order_id TEXT,
    order_date TEXT,
    ship_date TEXT,
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
    sales TEXT,
    quantity TEXT,
    discount TEXT,
    profit TEXT,
    shipping_cost TEXT,
    order_priority TEXT,
    year TEXT
);