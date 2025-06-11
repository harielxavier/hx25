import Stripe from 'stripe';

export class PaymentProcessor {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16'
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true }
    });
  }

  async createSubscription(customerId: string, priceId: string) {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });
  }

  async createCustomer(email: string, name: string) {
    return this.stripe.customers.create({
      email,
      name
    });
  }
}