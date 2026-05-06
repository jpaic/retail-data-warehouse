# Retail Data Warehouse - Superstore Orders

An end-to-end retail analytics project built on the Global Superstore dataset.

The project covers source ingestion, staging, data quality validation, dimensional modelling, SQL mart views, Power BI reporting, and a modern Next.js dashboard connected to PostgreSQL through API routes.

Dataset scale:

- 51,290 order lines
- $12.6M reconciled revenue
- Global retail sales from 2011-2014

---

## Live Demo

**[Retail Analytics Dashboard](https://jpaic-retail-dwh.vercel.app)**  

The Next.js dashboard is the main serving/presentation layer. It reads from PostgreSQL through API routes and is designed for Vercel deployment


---

## Technologies Used

| Layer | Tools |
|---|---|
| Source Data | Kaggle - Superstore Sales Analytics |
| Database | PostgreSQL, Neon |
| ETL | SQL, Python |
| Staging & Marts | PostgreSQL schemas, star schema, SQL views |
| Data Validation | SQL checks |
| Web API | Next.js API Routes, `pg` |
| Web Dashboard | Next.js, React, TypeScript, TailwindCSS, Recharts |
| BI Dashboard | Power BI |
| EDA / Showcase | Python, pandas, Streamlit, Plotly |
| Deployment Target | Vercel |
| Version Control | Git / GitHub |

---

## Architecture

```text
CSV Source
    |
    v
raw.orders
    |
    v
staging.orders_clean
    |
    v
marts.dim_* + marts.fact_sales
    |
    v
marts.vw_* dashboard views
    |
    +--> Power BI Dashboard
    |
    +--> Next.js API Routes
             |
             v
         React Dashboard UI
             |
             v
          Vercel
```

The browser never connects directly to PostgreSQL. The web dashboard consumes JSON from Next.js API routes, and those routes query only the SQL mart/views layer.

---

## Star Schema

```text
                    dim_date
                       |
dim_customers -- fact_sales -- dim_products
                       |
                 dim_geography
```

| Table | Grain | Key |
|---|---|---|
| `marts.fact_sales` | One row per order line | `sales_key` |
| `marts.dim_customers` | One row per customer + segment | `customer_key` |
| `marts.dim_products` | One row per product ID | `product_key` |
| `marts.dim_geography` | One row per state/country/region/market | `geography_key` |
| `marts.dim_date` | One row per calendar date | `date_id` |

---

## ETL Process

### 1. Raw Ingestion

Scripts: `sql/schema/01_raw_schema.sql`, `etl/load_raw.py`

The raw CSV is loaded into `raw.orders`. Fields are initially stored as text to keep ingestion tolerant of source formatting issues.

### 2. Staging

Scripts:

- `sql/schema/02_staging_schema.sql`
- `sql/staging/03_raw_to_staging.sql`
- `sql/staging/04_duplicate_removal.sql`
- `sql/staging/05_missing_values.sql`

The staging layer casts fields to analytical types, parses dates, normalizes numeric formatting, removes true duplicates, and validates critical nulls.

Key transformations:

- Dates parsed from `DD/MM/YYYY`
- Comma-formatted numerics cleaned before casting
- Empty strings converted to `NULL`
- Duplicate checks preserve valid multi-line orders

### 3. Dimensional Modelling

Scripts:

- `sql/marts/06_star_schema.sql`
- `sql/marts/07_load_dimensions.sql`
- `sql/marts/08_load_fact_sales.sql`

The marts layer creates a star schema with surrogate keys and a fact table at order-line grain.

Dimension loading rules:

- Customers deduplicated by `customer_name + segment`
- Products deduplicated by `product_id`
- Geography deduplicated by `state + country + region + market`
- Dates materialized as a reusable calendar dimension

### 4. Dashboard Views

Script: `sql/dashboard/10_dashboard_views.sql`

The dashboard layer exposes pre-aggregated analytical views:

- `marts.vw_sales_overview`
- `marts.vw_customer_analytics`
- `marts.vw_product_analytics`
- `marts.vw_time_analysis`

These views support both the Power BI report and the Next.js API layer.

---

## Data Quality Validation

Script: `sql/validation/09_data_quality_checks.sql`

All core checks passed after pipeline completion:

| Check | Result |
|---|---|
| Raw to staging row count | Match |
| Staging to fact row count | 51,290 rows |
| Revenue reconciliation | $12,642,905 |
| Orphan keys in fact table | None |
| NULL surrogate keys | None |

---

## Next.js Dashboard

The web dashboard lives in `app/frontend`.

It is built with:

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Recharts
- Next.js API Routes
- PostgreSQL via `pg`

### Dashboard Pages

| Route | Purpose |
|---|---|
| `/dashboard` | Executive overview |
| `/dashboard/sales` | Sales trends, market revenue, order priority |
| `/dashboard/customers` | Top customers, segment mix, regional performance |
| `/dashboard/products` | Category, sub-category, margin, and top product analysis |
| `/dashboard/time` | Annual, quarterly, monthly, and seasonality analysis |
| `/dashboard/insights` | Narrative business findings |

### API Routes

| Route | Purpose |
|---|---|
| `/api/overview` | Executive KPI and summary charts |
| `/api/sales` | Sales overview payload |
| `/api/customers` | Customer analytics payload |
| `/api/products` | Product analytics payload |
| `/api/time` | Time analysis payload |
| `/api/categories` | Category performance |
| `/api/regions` | Regional performance |

API routes query the mart/views layer only. Raw and staging tables are not exposed to the frontend.


## Power BI Dashboard

The Power BI dashboard is stored in:

```text
dashboard/powerbi/retail_dwh.pbix
```

It connects to PostgreSQL through the dashboard mart views and contains four analytical pages.

### Page 1 - Sales Overview

![Sales Overview](images/page1_sales_overview.JPG)

- Total revenue: $12,642,905
- Total orders: 51,290
- Revenue grew consistently year-over-year, with peak performance in 2014.

### Page 2 - Customer Analytics

![Customer Analytics](images/page2_customer_analytics.JPG)

- APAC is the highest revenue market globally.
- Consumer is the largest segment by revenue/order activity.
- Top customers are concentrated in APAC and EU markets.

### Page 3 - Product Analytics

![Product Analytics](images/page3_product_analytics.JPG)

- Technology is the strongest category by revenue.
- Office Supplies has high order volume but thinner margins.
- Phones, Copiers, and Chairs are leading sub-categories.

### Page 4 - Time Analysis

![Time Analysis](images/page4_time_analysis.JPG)

- 2014 was the highest revenue year.
- Q4 seasonality is visible across all years.
- Revenue trends upward from 2011 to 2014.

---

## Challenges & Solutions

### Fan-out bug in fact table

Initial fact loading produced more fact rows than staging rows. The root cause was duplicate geography dimension records caused by a bad geography mapping. The fix was to set `city = NULL` because the source lacks city data and use `(state, country, region, market)` as the geography natural key.

### Product name inconsistency

The same `product_id` appeared with slightly different product names. Loading distinct `product_id + product_name` pairs created duplicate product dimension rows. The fix was to group by `product_id` and choose a canonical product name with `MIN(product_name)`.

### Numeric formatting

Source fields such as `sales`, `profit`, and `shipping_cost` contained comma-formatted values. The staging SQL removes commas before numeric casting.

### Dashboard serving layer

The web dashboard avoids direct database access from the browser. Next.js API routes own the PostgreSQL connection and return JSON payloads to React pages.

---

## Future Improvements

- Add URL-based filters for year, category, and region in the Next.js dashboard
- Add drill-through detail tables for customers, products, and regions
- Add authentication for dashboard access
- Add CI checks for SQL validation and Next.js lint/build
- Convert SQL scripts to dbt models with tests and lineage
- Add incremental loading with watermark logic
- Add orchestration with Airflow or GitHub Actions
- Add SCD Type 2 dimensions for historical customer/product changes
- Add RFM customer segmentation
- Add city-level geography enrichment if a reliable location source is introduced

---

## Project Structure

```text
RetailDataWarehouse/
|   README.md
|   LICENSE
|
+---app/
|   +---frontend/                  <- Next.js dashboard + API presentation layer
|       |   README.md
|       |   package.json
|       |   package-lock.json
|       |   tsconfig.json
|       |   next.config.ts
|       |   postcss.config.mjs
|       |   eslint.config.mjs
|       |
|       +---app/                   <- Next.js App Router
|       |   |   layout.tsx
|       |   |   page.tsx           <- Redirects to /dashboard
|       |   |   globals.css
|       |   |
|       |   +---dashboard/         <- Multi-page analytics dashboard
|       |   |   |   page.tsx       <- Executive overview
|       |   |   +---sales/
|       |   |   +---customers/
|       |   |   +---products/
|       |   |   +---time/
|       |   |   +---insights/
|       |   |
|       |   +---api/               <- API routes over PostgreSQL marts
|       |       +---overview/
|       |       +---sales/
|       |       +---customers/
|       |       +---products/
|       |       +---time/
|       |       +---categories/
|       |       +---regions/
|       |
|       +---components/
|       |   +---cards/
|       |   +---charts/
|       |   +---layout/
|       |   +---pages/
|       |
|       +---lib/
|       |       db.ts
|       |       api.ts
|       |       queries.ts
|       |       format.ts
|       |
|       +---types/
|       |       dashboard.ts
|       |
|       +---public/
|
+---data/
|   +---raw/                       <- Source CSV
|   +---cleaned/                   <- Cleaned/staging export
|
+---etl/
|       load_raw.py                <- Raw CSV load script
|
+---notebooks/
|       eda.ipynb                  <- Exploratory data analysis
|
+---sql/
|   +---schema/
|   |       01_raw_schema.sql
|   |       02_staging_schema.sql
|   +---staging/
|   |       03_raw_to_staging.sql
|   |       04_duplicate_removal.sql
|   |       05_missing_values.sql
|   +---marts/
|   |       06_star_schema.sql
|   |       07_load_dimensions.sql
|   |       08_load_fact_sales.sql
|   +---validation/
|   |       09_data_quality_checks.sql
|   +---dashboard/
|           10_dashboard_views.sql
|
+---dashboard/
|   +---powerbi/
|           retail_dwh.pbix
|
+---images/
        page1_sales_overview.JPG
        page2_customer_analytics.JPG
        page3_product_analytics.JPG
        page4_time_analysis.JPG
```
