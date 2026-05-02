-- STAR SCHEMA LAYER
-- Data warehouse dimensional model (star schema)
-- Defines fact and dimension tables

-- DIMENSION TABLE: CUSTOMERS
-- Stores unique customer information

CREATE TABLE marts.dim_customers (
    customer_key SERIAL PRIMARY KEY,
    customer_name TEXT,
    segment TEXT
);

-- DIMENSION TABLE: PRODUCTS
-- Stores product attributes

CREATE TABLE marts.dim_products (
    product_key SERIAL PRIMARY KEY,
    product_id TEXT,
    product_name TEXT,
    category TEXT,
    sub_category TEXT
);

-- DIMENSION TABLE: GEOGRAPHY
-- Stores location hierarchy (city/state/country/region/market)

CREATE TABLE marts.dim_geography (
    geography_key SERIAL PRIMARY KEY,
    city TEXT,
    state TEXT,
    country TEXT,
    region TEXT,
    market TEXT
);

-- DIMENSION TABLE: DATE
-- Stores calendar breakdown for time analysis

CREATE TABLE marts.dim_date (
    date_id INTEGER PRIMARY KEY,
    full_date DATE,
    day INTEGER,
    month INTEGER,
    year INTEGER,
    quarter INTEGER
);

-- FACT TABLE: SALES
-- Stores measurable business events at order line grain

CREATE TABLE marts.fact_sales (
    sales_key SERIAL PRIMARY KEY,
    customer_key INTEGER,
    product_key INTEGER,
    geography_key INTEGER,
    date_id INTEGER,

    quantity INTEGER,
    revenue NUMERIC,
    profit NUMERIC,
    shipping_cost NUMERIC,
    discount NUMERIC,
    order_priority TEXT
);