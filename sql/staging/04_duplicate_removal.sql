-- REMOVE ONLY TRUE DUPLICATES (NOT VALID ORDER LINES)

DELETE FROM staging.orders_clean a
USING staging.orders_clean b
WHERE a.ctid < b.ctid
AND a.order_id = b.order_id
AND a.product_id = b.product_id
AND a.order_date = b.order_date
AND a.sales = b.sales
AND a.quantity = b.quantity;