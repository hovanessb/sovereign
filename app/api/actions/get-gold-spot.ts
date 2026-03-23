// app/api/actions/get-gold-spot.ts
"use server";

export async function getGoldSpotPrice(): Promise<number | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10s timeout

        const res = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`,
            {
                next: { revalidate: 3600 }, // cache for 1 hour
                signal: controller.signal,
            }
        );
        clearTimeout(timeoutId);

        const data = await res.json();

        // The previous close price ('c') inside the results array
        if (!data.results || data.results.length === 0) {
            console.warn("[BARTAMIAN] Gold spot: empty results from Polygon");
            return null;
        }

        return data.results[0].c;
    } catch (error) {
        console.error("[BARTAMIAN] Failed to fetch gold spot price:", error);
        return null;
    }
}