"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { deletePost, togglePublished } from "./actions";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import type { BlogPost } from "@/types/database";

interface BlogTableProps {
  posts: BlogPost[];
}

type BlogPostRow = BlogPost & Record<string, unknown>;

function BlogTable({ posts }: BlogTableProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deletePost(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if ("error" in result) addToast("error", result.error);
    else { addToast("success", "Post eliminato"); router.refresh(); }
  }, [deleteId, addToast, router]);

  const handleToggle = useCallback(async (id: string) => {
    const result = await togglePublished(id);
    if ("error" in result) addToast("error", result.error);
    else { addToast("success", "Stato aggiornato"); router.refresh(); }
  }, [addToast, router]);

  const columns: DataTableColumn<BlogPostRow>[] = [
    { header: "Titolo", accessor: "title", sortable: true },
    {
      header: "Stato",
      accessor: "is_published",
      render: (val) => <Badge variant={val ? "success" : "warning"}>{val ? "Pubblicato" : "Bozza"}</Badge>,
    },
    {
      header: "Data",
      accessor: "created_at",
      sortable: true,
      render: (val) => format(new Date(val as string), "dd/MM/yyyy", { locale: it }),
    },
    {
      header: "Tags",
      accessor: "tags",
      render: (val) => (val as string[]).join(", ") || "—",
    },
  ];

  const actions: DataTableAction<BlogPostRow>[] = [
    { label: "Modifica", onClick: (row) => router.push(`/admin/blog/${row.id}/edit`) },
    { label: "Pubblica/Nascondi", onClick: (row) => void handleToggle(row.id) },
    { label: "Elimina", danger: true, onClick: (row) => setDeleteId(row.id) },
  ];

  return (
    <>
      <DataTable<BlogPostRow>
        data={posts as BlogPostRow[]}
        columns={columns}
        rowKey="id"
        actions={actions}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Elimina post"
        description="Sei sicuro di voler eliminare questo post?"
        confirmLabel="Elimina"
        danger
        loading={deleting}
      />
    </>
  );
}

export { BlogTable };
