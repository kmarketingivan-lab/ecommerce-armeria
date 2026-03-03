import Stripe from "stripe";

// Lazy singleton — avoids crash at build time when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key || key.includes("placeholder")) {
        throw new Error("STRIPE_SECRET_KEY non configurata");
      }
      _stripe = new Stripe(key, { apiVersion: "2026-02-25.clover" });
    }
    const value = (_stripe as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(_stripe) : value;
  },
});
