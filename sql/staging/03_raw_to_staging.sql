-- RAW → STAGING TRANSFORMATION LAYER
-- Converts TEXT fields into proper data types
-- Cleans numeric formatting issues (commas, empty strings)

INSERT INTO staging.orders_clean
SELECT
    order_id,

    TO_DATE(order_date, 'DD/MM/YYYY') AS order_date,
    TO_DATE(ship_date, 'DD/MM/YYYY') AS ship_date,

    ship_mode,
    customer_name,
    segment,
    state,
    country,
    market,
    region,

    product_id,
    category,
    sub_category,
    product_name,

    CAST(NULLIF(REPLACE(sales, ',', ''), '') AS NUMERIC),
    CAST(NULLIF(quantity, '') AS INTEGER),
    CAST(NULLIF(discount, '') AS NUMERIC),
    CAST(NULLIF(REPLACE(profit, ',', ''), '') AS NUMERIC),
    CAST(NULLIF(REPLACE(shipping_cost, ',', ''), '') AS NUMERIC),

    order_priority,
    CAST(NULLIF(year, '') AS INTEGER)

FROM raw.orders;