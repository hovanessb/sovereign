// app/api/actions/get-gold-spot.ts
"use server";

export async function getGoldSpotPrice(): Promise<number> {
    // Polygon.io Forex endpoint for Gold (XAU) vs USD
    const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/C:XAUUSD/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`,
        { next: { revalidate: 3600 } }  // cache for 1 hour
    );
    const data = await res.json();

    // The previous close price ('c') inside the results array
    if (!data.results || data.results.length === 0) {
        throw new Error("Failed to fetch Gold Spot from Polygon");
    }

    return data.results[0].c;
}