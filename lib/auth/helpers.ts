import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get the current authenticated user with their role.
 * @returns User info with role, or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    role: profile?.role ?? "customer",
  };
}

/**
 * Require authentication. Redirects to login if not authenticated.
 * @returns The authenticated user
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}

/**
 * Require admin role. Redirects if not admin.
 * @returns The authenticated admin user
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}

/**
 * Check if a user has admin role.
 * @param userId - The user ID to check
 * @returns True if the user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin";
}
