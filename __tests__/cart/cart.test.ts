import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "crypto";

const HMAC_SECRET = "test-secret-key-for-hmac";

// Mock environment
vi.stubEnv("HMAC_SECRET", HMAC_SECRET);

// Mock cookies store
let cookieStore: Record<string, string> = {};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn((name: string) => {
      const value = cookieStore[name];
      return value ? { value } : undefined;
    }),
    set: vi.fn((name: string, value: string) => {
      cookieStore[name] = value;
    }),
    delete: vi.fn((name: string) => {
      delete cookieStore[name];
    }),
  })),
}));

// Mock Supabase for calculateTotals
const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({
  select: mockSelect,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

import {
  getCart,
  setCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  calculateTotals,
} from "@/lib/cart/cart";
import type { CartItem } from "@/lib/cart/types";

/**
 * Helper to create a valid signed cart cookie value.
 */
function createSignedCookie(items: CartItem[]): string {
  const signature = createHmac("sha256", HMAC_SECRET)
    .update(JSON.stringify(items))
    .digest("hex");
  return JSON.stringify({ items, signature });
}

describe("Cart Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookieStore = {};
  });

  describe("getCart", () => {
    it("should return empty array when no cookie exists", async () => {
      const items = await getCart();
      expect(items).toEqual([]);
    });

    it("should return items from valid signed cookie", async () => {
      const cartItems: CartItem[] = [
        { productId: "p1", variantId: null, quantity: 2 },
      ];
      cookieStore.cart = createSignedCookie(cartItems);

      const items = await getCart();
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ productId: "p1", variantId: null, quantity: 2 });
    });

    it("should return empty array for tampered cookie", async () => {
      const cartItems: CartItem[] = [
        { productId: "p1", variantId: null, quantity: 2 },
      ];
      const cookie = createSignedCookie(cartItems);
      // Tamper: change quantity
      const parsed = JSON.parse(cookie) as { items: CartItem[]; signature: string };
      if (parsed.items[0]) {
        parsed.items[0].quantity = 99;
      }
      cookieStore.cart = JSON.stringify(parsed);

      const items = await getCart();
      expect(items).toEqual([]);
    });

    it("should return empty array for malformed cookie", async () => {
      cookieStore.cart = "not-valid-json{{{";
      const items = await getCart();
      expect(items).toEqual([]);
    });
  });

  describe("setCart", () => {
    it("should save items with HMAC signature", async () => {
      const cartItems: CartItem[] = [
        { productId: "p1", variantId: "v1", quantity: 3 },
      ];

      await setCart(cartItems);

      expect(cookieStore.cart).toBeDefined();
      const saved = JSON.parse(cookieStore.cart ?? "{}") as { items: CartItem[]; signature: string };
      expect(saved.items).toHaveLength(1);
      expect(saved.signature).toBeTruthy();

      // Verify signature is valid
      const expectedSig = createHmac("sha256", HMAC_SECRET)
        .update(JSON.stringify(cartItems))
        .digest("hex");
      expect(saved.signature).toBe(expectedSig);
    });
  });

  describe("addToCart", () => {
    it("should add new item to empty cart", async () => {
      await addToCart("p1", null, 1);

      const items = await getCart();
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ productId: "p1", variantId: null, quantity: 1 });
    });

    it("should increment quantity for existing item", async () => {
      cookieStore.cart = createSignedCookie([
        { productId: "p1", variantId: null, quantity: 2 },
      ]);

      await addToCart("p1", null, 3);

      const items = await getCart();
      expect(items).toHaveLength(1);
      expect(items[0]?.quantity).toBe(5);
    });

    it("should add separate item for different variant", async () => {
      cookieStore.cart = createSignedCookie([
        { productId: "p1", variantId: null, quantity: 1 },
      ]);

      await addToCart("p1", "v1", 1);

      const items = await getCart();
      expect(items).toHaveLength(2);
    });
  });

  describe("updateQuantity", () => {
    it("should update quantity of existing item", async () => {
      cookieStore.cart = createSignedCookie([
        { productId: "p1", variantId: null, quantity: 2 },
      ]);

      await updateQuantity("p1", null, 5);

      const items = await getCart();
      expect(items[0]?.quantity).toBe(5);
    });

    it("should remove item when quantity is 0", async () => {
      cookieStore.cart = createSignedCookie([
        { productId: "p1", variantId: null, quantity: 2 },
        { productId: "p2", variantId: null, quantity: 1 },
      ]);

      await updateQuantity("p1", null, 0);

      const items = await getCart();
      expect(items).toHaveLength(1);
      expect(items[0]?.productId).toBe("p2");
    });
  });

  describe("removeFromCart", () => {
    it("should remove a specific item", async () => {
      cookieStore.cart = createSignedCookie([
        { productId: "p1", variantId: null, quantity: 2 },
        { productId: "p2", variantId: "v1", quantity: 1 },
      ]);

      await removeFromCart("p1", null);

      const items = await getCart();
      expect(items).toHaveLength(1);
      expect(items[0]?.productId).toBe("p2");
    });
  });

  describe("clearCart", () => {
    it("should remove all items", async () => {
      cookieStore.cart = createSignedCookie([
        { productId: "p1", variantId: null, quantity: 2 },
        { productId: "p2", variantId: null, quantity: 1 },
      ]);

      await clearCart();

      const items = await getCart();
      expect(items).toHaveLength(0);
    });
  });

  describe("calculateTotals", () => {
    it("should return zeros for empty cart", async () => {
      const result = await calculateTotals([]);
      expect(result.subtotal).toBe(0);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(0);
      expect(result.items).toHaveLength(0);
    });

    it("should calculate totals from DB prices", async () => {
      // Mock product query
      let fromCallCount = 0;
      mockFrom.mockImplementation(() => {
        fromCallCount++;
        if (fromCallCount === 1) {
          // products query
          return {
            select: vi.fn(() => ({
              in: vi.fn(() =>
                Promise.resolve({
                  data: [{ id: "p1", name: "Product 1", price: 25.0 }],
                  error: null,
                })
              ),
            })),
          };
        }
        // site_settings query (tax_rate)
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() =>
                Promise.resolve({
                  data: { value: 22 },
                  error: null,
                })
              ),
            })),
          })),
        };
      });

      const items: CartItem[] = [
        { productId: "p1", variantId: null, quantity: 2 },
      ];

      const result = await calculateTotals(items);

      expect(result.subtotal).toBe(50.0);
      expect(result.tax).toBe(11.0); // 50 * 0.22
      expect(result.total).toBe(61.0);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]?.name).toBe("Product 1");
      expect(result.items[0]?.price).toBe(25.0);
      expect(result.items[0]?.total).toBe(50.0);
    });

    it("should use fresh DB prices even if client tried to tamper", async () => {
      // Even if cart somehow had a different price, calculateTotals always
      // reads from DB — CartItem has NO price field
      let fromCallCount = 0;
      mockFrom.mockImplementation(() => {
        fromCallCount++;
        if (fromCallCount === 1) {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() =>
                Promise.resolve({
                  data: [{ id: "p1", name: "Expensive Product", price: 100.0 }],
                  error: null,
                })
              ),
            })),
          };
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() =>
                Promise.resolve({
                  data: { value: 22 },
                  error: null,
                })
              ),
            })),
          })),
        };
      });

      const items: CartItem[] = [
        { productId: "p1", variantId: null, quantity: 1 },
      ];

      const result = await calculateTotals(items);

      // Price is always from DB, never from client
      expect(result.subtotal).toBe(100.0);
      expect(result.items[0]?.price).toBe(100.0);
    });
  });
});
