"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Badge, getStatusVariant } from "@/components/ui/badge";
import type { Booking } from "@/types/database";

interface BookingsTableProps {
  bookings: Booking[];
  totalCount: number;
  page: number;
  currentStatus: string;
}

type BookingRow = Booking & Record<string, unknown>;

function BookingsTable({ bookings, totalCount, page, currentStatus }: BookingsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/admin/bookings?${params.toString()}`);
    },
    [router, searchParams]
  );

  const columns: DataTableColumn<BookingRow>[] = [
    { header: "Data", accessor: "booking_date", sortable: true },
    { header: "Orario", accessor: (row) => `${row.start_time} - ${row.end_time}` },
    { header: "Cliente", accessor: "customer_name" },
    { header: "Email", accessor: "customer_email" },
    {
      header: "Stato",
      accessor: "status",
      render: (val) => <Badge variant={getStatusVariant(val as string)}>{val as string}</Badge>,
    },
  ];

  return (
    <>
      <select
        value={currentStatus}
        onChange={(e) => updateParams("status", e.target.value || null)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        aria-label="Filtra per stato"
      >
        <option value="">Tutti gli stati</option>
        <option value="pending">In attesa</option>
        <option value="confirmed">Confermata</option>
        <option value="completed">Completata</option>
        <option value="cancelled">Annullata</option>
        <option value="no_show">No show</option>
      </select>

      <DataTable<BookingRow>
        data={bookings as BookingRow[]}
        columns={columns}
        rowKey="id"
        actions={[{
          label: "Dettaglio",
          onClick: (row) => router.push(`/admin/bookings/${row.id}`),
        }]}
        page={page}
        perPage={20}
        totalCount={totalCount}
        onPageChange={(p) => updateParams("page", String(p))}
      />
    </>
  );
}

export { BookingsTable };
