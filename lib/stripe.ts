/**
 * lib/stripe.ts
 * Stripe client and product sync utilities
 */

import Stripe from 'stripe';

// Initialize Stripe client - only if API key is available
const apiKey = process.env.STRIPE_API_KEY || process.env.STRIPE_SECRET_KEY;

if (!apiKey && typeof window === 'undefined') {
  console.warn('⚠️ STRIPE_API_KEY not set - Stripe functionality will be limited');
}

export const stripe = apiKey
  ? new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia',
    })
  : null;

/**
 * Fetch all active products from Stripe
 */
export async function getStripeProducts() {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_API_KEY environment variable.');
  }

  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    // Transform Stripe data to our package format
    const packages = prices.data
      .map((price) => {
        const product = price.product as Stripe.Product;

        if (!product || typeof product === 'string') return null;

        return {
          stripeProductId: product.id,
          stripePriceId: price.id,
          name: product.name,
          description: product.description || '',
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          currency: price.currency,
          interval: price.recurring?.interval || 'month',
          features: product.metadata?.features
            ? JSON.parse(product.metadata.features)
            : [],
          active: product.active && price.active,
          metadata: product.metadata,
        };
      })
      .filter((pkg): pkg is NonNullable<typeof pkg> => pkg !== null)
      .sort((a, b) => a.price - b.price);

    return packages;
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
}

/**
 * Get a specific product by ID
 */
export async function getStripeProduct(productId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_API_KEY environment variable.');
  }

  try {
    const product = await stripe.products.retrieve(productId);
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
    });

    if (prices.data.length === 0) {
      throw new Error('No active prices found for product');
    }

    const price = prices.data[0];

    return {
      stripeProductId: product.id,
      stripePriceId: price.id,
      name: product.name,
      description: product.description || '',
      price: price.unit_amount ? price.unit_amount / 100 : 0,
      currency: price.currency,
      interval: price.recurring?.interval || 'month',
      features: product.metadata?.features
        ? JSON.parse(product.metadata.features)
        : [],
      active: product.active && price.active,
      metadata: product.metadata,
    };
  } catch (error) {
    console.error('Error fetching Stripe product:', error);
    throw error;
  }
}

/**
 * Create a checkout session
 */
export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_API_KEY environment variable.');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      customer: customerId,
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Map Stripe product names to standardized tier names
 */
export function mapProductNameToTier(productName: string): string {
  const lowerName = productName.toLowerCase();

  if (lowerName.includes('starter') || lowerName.includes('free')) {
    return 'Starter';
  } else if (lowerName.includes('pro') && !lowerName.includes('enterprise')) {
    return 'Pro';
  } else if (lowerName.includes('platform') || lowerName.includes('team')) {
    return 'Platform & Teams';
  } else if (lowerName.includes('enterprise')) {
    return 'Enterprise';
  }

  return productName;
}

/**
 * Sync Stripe products to MongoDB
 */
export async function syncStripeProductsToMongo(mongoClient: any) {
  try {
    const products = await getStripeProducts();
    const db = mongoClient.db('saintsal');
    const packagesCollection = db.collection('packages');

    // Clear existing packages
    await packagesCollection.deleteMany({});

    // Insert Stripe products
    const packagesToInsert = products.map((product) => ({
      ...product,
      tier: mapProductNameToTier(product.name),
      limits: {
        messages: product.name.toLowerCase().includes('starter') ? 1000 : -1,
        tokens: product.name.toLowerCase().includes('starter') ? 500000 : -1,
      },
      syncedAt: new Date(),
    }));

    if (packagesToInsert.length > 0) {
      await packagesCollection.insertMany(packagesToInsert);
    }

    return packagesToInsert;
  } catch (error) {
    console.error('Error syncing Stripe products to MongoDB:', error);
    throw error;
  }
}
