import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/helpers";
import { AccountSidebar } from "@/components/storefront/account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="container-fluid py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
