/**
 * app/api/webhooks/stripe/route.ts
 * Stripe Webhook Handler - Updates user plan after payment
 * CRITICAL: This is what upgrades users from free → pro/enterprise after they pay
 */
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { getDb } from '../../../../lib/mongodb';
import { getPlanLimits, PRICING_TIERS } from '../../../../lib/mongodb-schema';

const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
const stripe = stripeKey
  ? new Stripe(stripeKey, {
      apiVersion: '2025-10-29.clover',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  console.log('🎯 [STRIPE WEBHOOK] Incoming webhook request...');

  if (!stripe) {
    console.error('❌ [STRIPE WEBHOOK] Stripe not configured');
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    );
  }

  if (!webhookSecret) {
    console.error('❌ [STRIPE WEBHOOK] Webhook secret not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.log('❌ [STRIPE WEBHOOK] No signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`✅ [STRIPE WEBHOOK] Signature verified: ${event.type}`);
    } catch (err: any) {
      console.error('❌ [STRIPE WEBHOOK] Signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💳 [STRIPE WEBHOOK] Checkout completed for customer: ${session.customer_email}`);

        // Get customer details
        const customerEmail = session.customer_email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!customerEmail) {
          console.log('⚠️ [STRIPE WEBHOOK] No customer email in session');
          return NextResponse.json({ received: true });
        }

        // Get subscription to determine the plan
        console.log(`🔍 [STRIPE WEBHOOK] Fetching subscription: ${subscriptionId}`);
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        console.log(`💰 [STRIPE WEBHOOK] Price ID: ${priceId}`);

        // Map price ID to plan
        // You'll need to update these with your actual Stripe price IDs
        let plan: 'pro' | 'enterprise' = 'pro';
        let limits = PRICING_TIERS[1].limits; // Default to pro

        // TODO: Update these price IDs with your actual Stripe price IDs from the dashboard
        // You can get them from: Stripe Dashboard → Products → Your product → API ID
        if (priceId.includes('enterprise') || subscription.items.data[0].price.unit_amount! >= 29700) {
          plan = 'enterprise';
          limits = PRICING_TIERS[2].limits;
          console.log('🏢 [STRIPE WEBHOOK] Detected ENTERPRISE plan');
        } else {
          plan = 'pro';
          limits = PRICING_TIERS[1].limits;
          console.log('💼 [STRIPE WEBHOOK] Detected PRO plan');
        }

        // Update user in MongoDB
        console.log(`📊 [STRIPE WEBHOOK] Updating user: ${customerEmail}`);
        const db = await getDb();
        const users = db.collection('users');

        const updateResult = await users.updateOne(
          { email: customerEmail.toLowerCase() },
          {
            $set: {
              plan: plan,
              limits: limits,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              updatedAt: new Date(),
            },
          }
        );

        if (updateResult.matchedCount === 0) {
          console.log(`⚠️ [STRIPE WEBHOOK] User not found: ${customerEmail}`);
          // User might not exist yet - this is okay for new signups
        } else {
          console.log(`✅ [STRIPE WEBHOOK] User upgraded to ${plan.toUpperCase()} plan!`);
          console.log(`📦 [STRIPE WEBHOOK] New limits: ${limits.messagesPerMonth} messages/month`);
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🔄 [STRIPE WEBHOOK] Subscription updated: ${subscription.id}`);

        // Handle subscription updates (plan changes, cancellations, etc.)
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);

        if ('email' in customer && customer.email) {
          const db = await getDb();
          const users = db.collection('users');

          // Check if subscription is active or canceled
          if (subscription.status === 'active') {
            const priceId = subscription.items.data[0].price.id;
            let plan: 'pro' | 'enterprise' = 'pro';
            let limits = PRICING_TIERS[1].limits;

            if (priceId.includes('enterprise') || subscription.items.data[0].price.unit_amount! >= 29700) {
              plan = 'enterprise';
              limits = PRICING_TIERS[2].limits;
            }

            await users.updateOne(
              { email: customer.email.toLowerCase() },
              {
                $set: {
                  plan: plan,
                  limits: limits,
                  updatedAt: new Date(),
                },
              }
            );
            console.log(`✅ [STRIPE WEBHOOK] Subscription reactivated for ${customer.email}`);
          } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            // Downgrade to free plan
            await users.updateOne(
              { email: customer.email.toLowerCase() },
              {
                $set: {
                  plan: 'free',
                  limits: PRICING_TIERS[0].limits,
                  updatedAt: new Date(),
                },
              }
            );
            console.log(`⚠️ [STRIPE WEBHOOK] Subscription canceled, downgraded to FREE: ${customer.email}`);
          }
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`❌ [STRIPE WEBHOOK] Subscription deleted: ${subscription.id}`);

        // Downgrade user to free plan
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId);

        if ('email' in customer && customer.email) {
          const db = await getDb();
          const users = db.collection('users');

          await users.updateOne(
            { email: customer.email.toLowerCase() },
            {
              $set: {
                plan: 'free',
                limits: PRICING_TIERS[0].limits,
                stripeSubscriptionId: null,
                updatedAt: new Date(),
              },
            }
          );
          console.log(`⚠️ [STRIPE WEBHOOK] User downgraded to FREE: ${customer.email}`);
        }

        break;
      }

      default:
        console.log(`ℹ️ [STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
    }

    console.log('🎉 [STRIPE WEBHOOK] Webhook processed successfully');
    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('❌ [STRIPE WEBHOOK] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}
