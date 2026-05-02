-- FACT TABLE LOAD LAYER
-- Loads transactional sales data at correct grain (one row per order line)
-- Ensures safe 1:1 joins to dimension tables

INSERT INTO marts.fact_sales (
    customer_key,
    product_key,
    geography_key,
    date_id,
    quantity,
    revenue,
    profit,
    shipping_cost,
    discount,
    order_priority
)
SELECT
    dc.customer_key,
    dp.product_key,
    dg.geography_key,

    EXTRACT(YEAR  FROM sc.order_date)::INT * 10000 +
    EXTRACT(MONTH FROM sc.order_date)::INT * 100   +
    EXTRACT(DAY   FROM sc.order_date)::INT          AS date_id,

    sc.quantity,
    sc.sales        AS revenue,
    sc.profit,
    sc.shipping_cost,
    sc.discount,
    sc.order_priority

FROM staging.orders_clean sc

-- CUSTOMER JOIN: 1:1 guaranteed by DISTINCT on (customer_name, segment)
JOIN marts.dim_customers dc
    ON  sc.customer_name = dc.customer_name
    AND sc.segment       = dc.segment

-- PRODUCT JOIN: 1:1 guaranteed by GROUP BY product_id in dimension load
JOIN marts.dim_products dp
    ON sc.product_id = dp.product_id

-- GEOGRAPHY JOIN: 1:1 guaranteed by DISTINCT on (state, country, region, market)
-- city is excluded — it is NULL in dim_geography (no city field in source)
JOIN marts.dim_geography dg
    ON  sc.state   = dg.state
    AND sc.country = dg.country
    AND sc.region  = dg.region
    AND sc.market  = dg.market;