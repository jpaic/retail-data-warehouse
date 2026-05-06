const cacheHeaders = {
  "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=3600",
};

export function cachedJson(data: unknown) {
  return Response.json(data, { headers: cacheHeaders });
}

export function databaseErrorResponse(error: unknown) {
  console.error("Database query failed", error);

  return Response.json(
    { error: "Unable to load dashboard data" },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}
