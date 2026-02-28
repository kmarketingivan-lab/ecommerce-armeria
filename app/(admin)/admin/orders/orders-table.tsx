"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import type { Order } from "@/types/database";

interface OrdersTableProps {
  orders: Order[];
  totalCount: number;
  page: number;
  currentStatus: string;
}

type OrderRow = Order & Record<string, unknown>;

const statusOptions = [
  { value: "", label: "Tutti" },
  { value: "pending", label: "In attesa" },
  { value: "confirmed", label: "Confermato" },
  { value: "processing", label: "In lavorazione" },
  { value: "shipped", label: "Spedito" },
  { value: "delivered", label: "Consegnato" },
  { value: "cancelled", label: "Annullato" },
  { value: "refunded", label: "Rimborsato" },
];

function OrdersTable({ orders, totalCount, page, currentStatus }: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/admin/orders?${params.toString()}`);
    },
    [router, searchParams]
  );

  const columns: DataTableColumn<OrderRow>[] = [
    { header: "N. Ordine", accessor: "order_number", sortable: true },
    { header: "Email", accessor: "email" },
    {
      header: "Totale",
      accessor: "total",
      sortable: true,
      render: (val) => `€${(val as number).toFixed(2)}`,
    },
    {
      header: "Stato",
      accessor: "status",
      render: (val) => <Badge variant={getStatusVariant(val as string)}>{val as string}</Badge>,
    },
    {
      header: "Data",
      accessor: "created_at",
      sortable: true,
      render: (val) => format(new Date(val as string), "dd/MM/yyyy HH:mm", { locale: it }),
    },
  ];

  return (
    <>
      <div className="flex gap-3">
        <select
          value={currentStatus}
          onChange={(e) => updateParams("status", e.target.value || null)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          aria-label="Filtra per stato"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <DataTable<OrderRow>
        data={orders as OrderRow[]}
        columns={columns}
        rowKey="id"
        actions={[{
          label: "Dettaglio",
          onClick: (row) => router.push(`/admin/orders/${row.id}`),
        }]}
        page={page}
        perPage={20}
        totalCount={totalCount}
        onPageChange={(p) => updateParams("page", String(p))}
      />
    </>
  );
}

export { OrdersTable };
