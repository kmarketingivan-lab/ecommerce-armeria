import { describe, it, expect } from "vitest";
import { orderSchema, orderItemSchema, orderStatusEnum, addressSchema } from "@/lib/validators/orders";

describe("orderStatusEnum", () => {
  it("should accept valid statuses", () => {
    const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
    for (const status of statuses) {
      expect(orderStatusEnum.safeParse(status).success).toBe(true);
    }
  });

  it("should reject invalid status", () => {
    expect(orderStatusEnum.safeParse("invalid").success).toBe(false);
  });
});

describe("addressSchema", () => {
  it("should accept valid address", () => {
    const result = addressSchema.safeParse({
      street: "Via Roma 42",
      city: "Milano",
      zip: "20121",
      country: "IT",
    });
    expect(result.success).toBe(true);
  });

  it("should reject address without street", () => {
    const result = addressSchema.safeParse({
      city: "Milano",
      zip: "20121",
      country: "IT",
    });
    expect(result.success).toBe(false);
  });

  it("should reject address without city", () => {
    const result = addressSchema.safeParse({
      street: "Via Roma 42",
      zip: "20121",
      country: "IT",
    });
    expect(result.success).toBe(false);
  });

  it("should reject address without zip", () => {
    const result = addressSchema.safeParse({
      street: "Via Roma 42",
      city: "Milano",
      country: "IT",
    });
    expect(result.success).toBe(false);
  });

  it("should reject address without country", () => {
    const result = addressSchema.safeParse({
      street: "Via Roma 42",
      city: "Milano",
      zip: "20121",
    });
    expect(result.success).toBe(false);
  });
});

describe("orderSchema", () => {
  it("should accept valid order", () => {
    const result = orderSchema.safeParse({
      email: "test@example.com",
      shipping_address: {
        street: "Via Roma 42",
        city: "Milano",
        zip: "20121",
        country: "IT",
      },
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = orderSchema.safeParse({
      email: "not-an-email",
      shipping_address: {
        street: "Via Roma 42",
        city: "Milano",
        zip: "20121",
        country: "IT",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("orderItemSchema", () => {
  it("should accept valid order item", () => {
    const result = orderItemSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      product_name: "Maglietta Rossa",
      quantity: 2,
      unit_price: 29.99,
      total_price: 59.98,
    });
    expect(result.success).toBe(true);
  });

  it("should reject quantity 0", () => {
    const result = orderItemSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      product_name: "Test",
      quantity: 0,
      unit_price: 10,
      total_price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative quantity", () => {
    const result = orderItemSchema.safeParse({
      product_id: "550e8400-e29b-41d4-a716-446655440000",
      product_name: "Test",
      quantity: -1,
      unit_price: 10,
      total_price: 0,
    });
    expect(result.success).toBe(false);
  });
});
