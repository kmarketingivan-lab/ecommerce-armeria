import { createClient } from "@/lib/supabase/server";
import type { Order, OrderItem } from "@/types/database";

interface GetOrdersOptions {
  page?: number;
  perPage?: number;
  status?: string;
  userId?: string;
}

interface PaginatedOrders {
  data: Order[];
  count: number;
}

/**
 * Get orders with filtering and pagination.
 * @param options - Filtering options
 * @returns Paginated orders
 */
export async function getOrders(
  options: GetOrdersOptions = {}
): Promise<PaginatedOrders> {
  const { page = 1, perPage = 20, status, userId } = options;
  const supabase = await createClient();
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" });

  if (status) {
    query = query.eq("status", status);
  }

  if (userId) {
    query = query.eq("user_id", userId);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: (data ?? []) as Order[],
    count: count ?? 0,
  };
}

/**
 * Get a single order by ID with its items.
 * @param id - Order UUID
 * @returns Order with items, or null
 */
export async function getOrderById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data as Order & { order_items: OrderItem[] };
}

/**
 * Get orders by user ID.
 * @param userId - User UUID
 * @returns Array of user's orders
 */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}

/**
 * Get order statistics (count per status).
 * @returns Map of status to count
 */
export async function getOrderStats(): Promise<Record<string, number>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("status");

  if (error) throw error;

  const stats: Record<string, number> = {};
  for (const row of data ?? []) {
    const s = (row as Record<string, unknown>).status as string;
    stats[s] = (stats[s] ?? 0) + 1;
  }

  return stats;
}
