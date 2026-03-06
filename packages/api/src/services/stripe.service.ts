import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export const stripeService = {
  async createPaymentIntent(amount: number, currency: string, metadata: Record<string, string>) {
    return stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  },

  async createCustomer(email: string, name: string) {
    return stripe.customers.create({ email, name });
  },

  async createSubscription(customerId: string, priceId: string, paymentMethodId?: string) {
    const params: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    };
    if (paymentMethodId) {
      params.default_payment_method = paymentMethodId;
    }
    return stripe.subscriptions.create(params);
  },

  async cancelSubscription(subscriptionId: string) {
    return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  },

  constructWebhookEvent(payload: Buffer, signature: string) {
    return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  },
};
