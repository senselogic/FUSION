// -- IMPORTS

import { logError } from "senselogic-opus";
import Stripe from "stripe";

// -- TYPES

class StripeService {
  client: Stripe | null;
  key: string | undefined;

  constructor() {
    this.client = null;
    this.key = process.env.FUSION_PROJECT_STRIPE_KEY;
  }

  // -- INQUIRIES

  getClient(): Stripe {
    if (this.client === null) {
      // Keep behavior stable; Stripe's TS types enforce a specific apiVersion literal.
      this.client = new Stripe(this.key ?? "", { apiVersion: "2026-04-22.dahlia" as any });
    }

    return this.client;
  }

  // -- OPERATIONS

  async createCheckoutSession(
    lineItemsArray: unknown[],
    successUrl: string,
    cancelUrl: string,
    customerEmail: string | null = null,
    metadata: Record<string, string> = {},
  ): Promise<unknown> {
    try {
      const sessionParams: Record<string, unknown> = {
        mode: "payment",
        line_items: lineItemsArray,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        ...(customerEmail !== null ? { customer_email: customerEmail } : {}),
      };

      return await (this.getClient().checkout.sessions as any).create(sessionParams);
    } catch (error) {
      logError(error);
      throw error;
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    try {
      return await this.getClient().checkout.sessions.retrieve(sessionId);
    } catch (error) {
      logError(error);
      throw error;
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    customerId: string | null = null,
    metadata: Record<string, string> = {},
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount,
        currency,
        metadata,
        ...(customerId !== null ? { customer: customerId } : {}),
      };

      return await this.getClient().paymentIntents.create(paymentIntentParams);
    } catch (error) {
      logError(error);
      throw error;
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.getClient().paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      logError(error);
      throw error;
    }
  }

  async createCustomer(email: string, name: string | null = null, metadata: Record<string, string> = {}): Promise<Stripe.Customer> {
    try {
      const customerParams: Stripe.CustomerCreateParams = {
        email,
        metadata,
        ...(name !== null ? { name } : {}),
      };

      return await this.getClient().customers.create(customerParams);
    } catch (error) {
      logError(error);
      throw error;
    }
  }

  async retrieveCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    try {
      return await this.getClient().customers.retrieve(customerId);
    } catch (error) {
      logError(error);
      throw error;
    }
  }

  constructWebhookEvent(payload: string | Buffer, signature: string, webhookSecret: string): Stripe.Event {
    try {
      return this.getClient().webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      logError(error);
      throw error;
    }
  }
}

// -- VARIABLES

export const stripeService = new StripeService();

