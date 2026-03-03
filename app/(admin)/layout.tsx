import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth/helpers";
import { AdminShell } from "@/components/layout/admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Skip auth check on login page — avoid infinite redirect loop
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const admin = await requireAdmin();

  return (
    <AdminShell userEmail={admin.email}>
      {children}
    </AdminShell>
  );
}
