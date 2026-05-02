-- DASHBOARD VIEWS LAYER
-- Pre-aggregated views to support Power BI dashboard pages
-- Run after marts tables are fully loaded

-- VIEW 1: SALES OVERVIEW
-- Supports Page 1 — revenue, profit, quantity trends over time

CREATE OR REPLACE VIEW marts.vw_sales_overview AS
SELECT
    dd.full_date,
    dd.year,
    dd.month,
    dd.quarter,
    fs.revenue,
    fs.profit,
    fs.quantity,
    fs.discount,
    fs.shipping_cost,
    fs.order_priority

FROM marts.fact_sales fs

-- DATE JOIN (must be 1:1)
JOIN marts.dim_date dd
    ON fs.date_id = dd.date_id;


-- VIEW 2: CUSTOMER ANALYTICS
-- Supports Page 2 — top customers, revenue by segment, geographic breakdown

CREATE OR REPLACE VIEW marts.vw_customer_analytics AS
SELECT
    dc.customer_name,
    dc.segment,
    dg.country,
    dg.region,
    dg.market,
    dd.year,
    dd.month,

    SUM(fs.revenue)  AS total_revenue,
    SUM(fs.profit)   AS total_profit,
    SUM(fs.quantity) AS total_quantity,
    COUNT(*)         AS total_orders

FROM marts.fact_sales fs

-- CUSTOMER JOIN (must be 1:1)
JOIN marts.dim_customers dc
    ON fs.customer_key = dc.customer_key

-- GEOGRAPHY JOIN (must be 1:1)
JOIN marts.dim_geography dg
    ON fs.geography_key = dg.geography_key

-- DATE JOIN (must be 1:1)
JOIN marts.dim_date dd
    ON fs.date_id = dd.date_id

GROUP BY
    dc.customer_name,
    dc.segment,
    dg.country,
    dg.region,
    dg.market,
    dd.year,
    dd.month;


-- VIEW 3: PRODUCT ANALYTICS
-- Supports Page 3 — best sellers, revenue by category, quantity by product

CREATE OR REPLACE VIEW marts.vw_product_analytics AS
SELECT
    dp.product_name,
    dp.category,
    dp.sub_category,
    dd.year,
    dd.month,

    SUM(fs.revenue)  AS total_revenue,
    SUM(fs.profit)   AS total_profit,
    SUM(fs.quantity) AS total_quantity

FROM marts.fact_sales fs

-- PRODUCT JOIN (must be 1:1)
JOIN marts.dim_products dp
    ON fs.product_key = dp.product_key

-- DATE JOIN (must be 1:1)
JOIN marts.dim_date dd
    ON fs.date_id = dd.date_id

GROUP BY
    dp.product_name,
    dp.category,
    dp.sub_category,
    dd.year,
    dd.month;


-- VIEW 4: TIME ANALYSIS
-- Supports Page 4 — monthly trends, quarterly aggregates, seasonality

CREATE OR REPLACE VIEW marts.vw_time_analysis AS
SELECT
    dd.year,
    dd.quarter,
    dd.month,

    SUM(fs.revenue)            AS total_revenue,
    SUM(fs.profit)             AS total_profit,
    COUNT(*)                   AS total_orders,
    SUM(fs.revenue) / COUNT(*) AS avg_order_value

FROM marts.fact_sales fs

-- DATE JOIN (must be 1:1)
JOIN marts.dim_date dd
    ON fs.date_id = dd.date_id

GROUP BY
    dd.year,
    dd.quarter,
    dd.month;