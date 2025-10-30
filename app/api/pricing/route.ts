/**
 * app/api/pricing/route.ts
 * Public pricing API - fetches from Stripe
 */
import { NextResponse } from "next/server";
import { getStripeProducts } from "@/lib/stripe";

export async function GET() {
  try {
    const products = await getStripeProducts();

    // Transform to pricing page format
    const pricing = products.map((product) => ({
      id: product.stripeProductId,
      priceId: product.stripePriceId,
      name: product.name,
      description: product.description,
      price: product.price,
      interval: product.interval,
      features: product.features,
      popular: product.name.toLowerCase().includes('professional') ||
               product.name.toLowerCase().includes('platform'),
    }));

    return NextResponse.json({
      success: true,
      plans: pricing,
    });
  } catch (error: any) {
    console.error("Pricing fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing" },
      { status: 500 }
    );
  }
}
