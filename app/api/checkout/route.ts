/**
 * BARTAMIAN — Stripe Checkout API Route
 * POST /api/checkout
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates a Stripe Checkout Session for a given Price ID and returns the
 * session URL. The client then redirects the browser to that URL.
 *
 * Security:
 *   • Rate limiting should be applied at the edge (Vercel middleware or
 *     Upstash Ratelimit) before this handler is reached.
 *   • The priceId is validated against the Stripe API — no lookup against
 *     our DB is strictly required since Stripe will reject invalid IDs,
 *     but a DB check adds defense-in-depth.
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe                        from "stripe";

// ─── Stripe Client ────────────────────────────────────────────────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  appInfo: {
    name:    "BARTAMIAN",
    version: "1.0.0",
    url:     "https://bartamian.com",
  },
});

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceId } = body as { priceId?: string };

    if (!priceId || typeof priceId !== "string" || !priceId.startsWith("price_")) {
      return NextResponse.json(
        { error: "Invalid price ID." },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode:                "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price:    priceId,
          quantity: 1,
        },
      ],

      // Shipping address collection — BARTAMIAN ships globally
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "FR", "DE", "IT", "ES", "AU",
          "JP", "AE", "SA", "SG", "HK", "CH", "NL", "SE",
        ],
      },

      // Automatic tax calculation (requires Stripe Tax to be enabled)
      automatic_tax: { enabled: true },

      // UI customization
      custom_text: {
        submit: {
          message:
            "Your piece will be inspected and dispatched within 3 business days.",
        },
      },

      // Redirect URLs
      success_url: `${origin}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/#vault`,

      // Metadata for webhook reconciliation
      metadata: {
        source: "bartamian_web",
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error("[BARTAMIAN/checkout] Stripe error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode ?? 500 }
      );
    }

    console.error("[BARTAMIAN/checkout] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
