# Retail Data Warehouse Dashboard

Next.js presentation layer for the PostgreSQL retail data warehouse hosted on Neon.

## Architecture

```text
PostgreSQL marts/views
        -> Next.js API routes
        -> React dashboard pages
        -> Vercel
```

The browser never connects to PostgreSQL directly. Dashboard pages consume JSON from API routes under `app/api/*`.

## Pages

- `/dashboard` - executive overview
- `/dashboard/sales` - sales trends, market revenue, order priority
- `/dashboard/customers` - top customers, segment mix, regional performance
- `/dashboard/products` - category, sub-category, margin, and top product analysis
- `/dashboard/time` - annual, quarterly, monthly, and seasonality analysis
- `/dashboard/insights` - narrative business findings

## API Routes

- `/api/overview`
- `/api/sales`
- `/api/customers`
- `/api/products`
- `/api/time`
- `/api/categories`
- `/api/regions`

All analytical SQL is executed against `marts.vw_*` views.

## Local Development

Create `.env.local`:

```bash
DATABASE_URL=your_neon_postgres_connection_string
```

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Verification

```bash
npm run lint
npm run build
```
