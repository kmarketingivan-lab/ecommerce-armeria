import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import type { Cart, CartItem, CartWithPrices, CartItemWithPrice } from "./types";

const CART_COOKIE = "cart";
const HMAC_ALGO = "sha256";

/**
 * Get the HMAC secret from environment.
 * @returns HMAC secret string
 */
function getHmacSecret(): string {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    throw new Error("HMAC_SECRET environment variable is required");
  }
  return secret;
}

/**
 * Sign cart data with HMAC-SHA256.
 * @param items - Cart items to sign
 * @returns HMAC signature hex string
 */
function signCart(items: CartItem[]): string {
  const payload = JSON.stringify(items);
  return createHmac(HMAC_ALGO, getHmacSecret()).update(payload).digest("hex");
}

/**
 * Verify HMAC signature of cart data.
 * @param items - Cart items
 * @param signature - HMAC signature to verify
 * @returns True if signature is valid
 */
function verifySignature(items: CartItem[], signature: string): boolean {
  const expected = signCart(items);
  return expected === signature;
}

/**
 * Get the current cart from cookie, verifying HMAC signature.
 * Returns empty cart if cookie is missing, tampered, or malformed.
 * @returns Cart items array
 */
export async function getCart(): Promise<CartItem[]> {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get(CART_COOKIE);

    if (!cartCookie?.value) return [];

    const cart: Cart = JSON.parse(cartCookie.value) as Cart;

    if (!cart.items || !Array.isArray(cart.items)) return [];

    if (!verifySignature(cart.items, cart.signature)) {
      logger.warn("Cart HMAC verification failed — tampered cookie detected");
      return [];
    }

    return cart.items;
  } catch {
    logger.warn("Failed to parse cart cookie");
    return [];
  }
}

/**
 * Save cart items to signed HMAC cookie.
 * @param items - Cart items to store
 */
export async function setCart(items: CartItem[]): Promise<void> {
  const cookieStore = await cookies();
  const signature = signCart(items);
  const cart: Cart = { items, signature };

  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Add a product to the cart. If already present, increment quantity.
 * @param productId - Product UUID
 * @param variantId - Variant UUID or null
 * @param quantity - Quantity to add (default 1)
 */
export async function addToCart(
  productId: string,
  variantId: string | null,
  quantity: number = 1
): Promise<void> {
  const items = await getCart();

  const existing = items.find(
    (i) => i.productId === productId && i.variantId === variantId
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, variantId, quantity });
  }

  await setCart(items);
}

/**
 * Update the quantity of a cart item. Removes item if quantity is 0.
 * @param productId - Product UUID
 * @param variantId - Variant UUID or null
 * @param quantity - New quantity (0 to remove)
 */
export async function updateQuantity(
  productId: string,
  variantId: string | null,
  quantity: number
): Promise<void> {
  let items = await getCart();

  if (quantity <= 0) {
    items = items.filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
  } else {
    const existing = items.find(
      (i) => i.productId === productId && i.variantId === variantId
    );
    if (existing) {
      existing.quantity = quantity;
    }
  }

  await setCart(items);
}

/**
 * Remove a product from the cart.
 * @param productId - Product UUID
 * @param variantId - Variant UUID or null
 */
export async function removeFromCart(
  productId: string,
  variantId: string | null
): Promise<void> {
  const items = await getCart();
  const filtered = items.filter(
    (i) => !(i.productId === productId && i.variantId === variantId)
  );
  await setCart(filtered);
}

/**
 * Clear all items from the cart.
 */
export async function clearCart(): Promise<void> {
  await setCart([]);
}

/**
 * Calculate cart totals by reading EVERY price from DB.
 * Never trusts client-side prices.
 * @param items - Cart items
 * @returns Cart with prices, subtotal, tax, shipping, and total
 */
export async function calculateTotals(
  items: CartItem[]
): Promise<CartWithPrices> {
  if (items.length === 0) {
    return { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 };
  }

  const supabase = await createClient();

  // Get all product prices from DB
  const productIds = [...new Set(items.map((i) => i.productId))];
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price")
    .in("id", productIds);

  // Get variant price adjustments if any variants
  const variantIds = items
    .map((i) => i.variantId)
    .filter((v): v is string => v !== null);

  const variantMap: Record<string, { price_adjustment: number; name: string }> = {};
  if (variantIds.length > 0) {
    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, name, price_adjustment")
      .in("id", variantIds);

    for (const v of variants ?? []) {
      const variant = v as { id: string; name: string; price_adjustment: number };
      variantMap[variant.id] = {
        price_adjustment: variant.price_adjustment,
        name: variant.name,
      };
    }
  }

  // Build product map
  const productMap: Record<string, { name: string; price: number }> = {};
  for (const p of products ?? []) {
    const product = p as { id: string; name: string; price: number };
    productMap[product.id] = { name: product.name, price: product.price };
  }

  // Calculate item totals
  const itemsWithPrices: CartItemWithPrice[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productMap[item.productId];
    if (!product) continue; // Skip items for deleted products

    let price = product.price;
    let name = product.name;

    if (item.variantId) {
      const variant = variantMap[item.variantId];
      if (variant) {
        price += variant.price_adjustment;
        name = `${product.name} - ${variant.name}`;
      }
    }

    const total = price * item.quantity;
    subtotal += total;

    itemsWithPrices.push({
      ...item,
      name,
      price,
      total,
    });
  }

  // Get tax rate from settings
  const { data: taxSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "tax_rate")
    .single();

  const taxRate = taxSetting
    ? Number((taxSetting as { value: unknown }).value) / 100
    : 0.22; // Default 22% Italian VAT

  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const shipping = 0; // Placeholder — can be calculated based on weight/settings
  const total = Math.round((subtotal + tax + shipping) * 100) / 100;

  return { items: itemsWithPrices, subtotal, tax, shipping, total };
}
