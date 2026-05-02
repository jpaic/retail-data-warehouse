-- DATA QUALITY VALIDATION LAYER
-- Final checks to ensure ETL pipeline integrity
-- Verifies data AFTER staging and marts processing

-- ROW COUNT CHECK (RAW VS STAGING)
-- Ensures no data loss during ingestion and transformation

SELECT
    (SELECT COUNT(*) FROM raw.orders) AS raw_count,
    (SELECT COUNT(*) FROM staging.orders_clean) AS staging_count;

-- ROW COUNT CHECK (STAGING VS FACT)
-- Ensures all staged data is loaded into fact table

SELECT
    (SELECT COUNT(*) FROM staging.orders_clean) AS staging_count,
    (SELECT COUNT(*) FROM marts.fact_sales) AS fact_count;

-- REVENUE RECONCILIATION CHECK
-- Ensures fact table revenue matches staging sales totals

SELECT
    (SELECT SUM(sales) FROM staging.orders_clean) AS staging_revenue,
    (SELECT SUM(revenue) FROM marts.fact_sales) AS fact_revenue;

-- ORPHAN KEY CHECK
-- Ensures fact table has valid relationships to dimensions

SELECT *
FROM marts.fact_sales
WHERE customer_key IS NULL
   OR product_key IS NULL
   OR geography_key IS NULL
   OR date_id IS NULL;

-- DIMENSION KEY CHECK
-- Ensures no missing surrogate keys in dimension tables

SELECT *
FROM marts.dim_customers
WHERE customer_key IS NULL;