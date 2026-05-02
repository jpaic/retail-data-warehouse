-- DIMENSIONS LOAD LAYER
-- Populates dimension tables with UNIQUE business keys

-- CUSTOMERS DIMENSION
-- Ensures one row per customer_name + segment

INSERT INTO marts.dim_customers (customer_name, segment)
SELECT DISTINCT
    customer_name,
    segment
FROM staging.orders_clean;

-- PRODUCTS DIMENSION
-- Deduplicates on product_id only (product_name may vary across rows for the same ID)
-- Uses MIN(product_name) to pick a single canonical name per product_id

INSERT INTO marts.dim_products (product_id, product_name, category, sub_category)
SELECT
    product_id,
    MIN(product_name) AS product_name,
    MIN(category)     AS category,
    MIN(sub_category) AS sub_category
FROM staging.orders_clean
GROUP BY product_id;

-- GEOGRAPHY DIMENSION
-- NOTE: Source dataset has no city column; state is used as the finest grain.
-- Ensures one row per (state, country, region, market) combination.
-- city column is left NULL — update this if a city field becomes available.

INSERT INTO marts.dim_geography (city, state, country, region, market)
SELECT DISTINCT
    NULL  AS city,   -- no city field in source data
    state,
    country,
    region,
    market
FROM staging.orders_clean;

-- DATE DIMENSION
-- Ensures one row per calendar date

INSERT INTO marts.dim_date (date_id, full_date, day, month, year, quarter)
SELECT DISTINCT
    EXTRACT(YEAR  FROM order_date)::INT * 10000 +
    EXTRACT(MONTH FROM order_date)::INT * 100   +
    EXTRACT(DAY   FROM order_date)::INT          AS date_id,

    order_date,
    EXTRACT(DAY     FROM order_date)::INT        AS day,
    EXTRACT(MONTH   FROM order_date)::INT        AS month,
    EXTRACT(YEAR    FROM order_date)::INT        AS year,
    EXTRACT(QUARTER FROM order_date)::INT        AS quarter
FROM staging.orders_clean;