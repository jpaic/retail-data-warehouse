-- MISSING VALUES CHECK

SELECT *
FROM staging.orders_clean
WHERE order_id IS NULL
   OR customer_name IS NULL
   OR sales IS NULL;