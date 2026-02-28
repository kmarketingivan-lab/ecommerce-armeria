"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { createService, updateService, deleteService } from "../actions";
import { Edit, Trash2, Plus } from "lucide-react";
import type { BookingService } from "@/types/database";

interface ServicesManagerProps {
  services: BookingService[];
}

function ServicesManager({ services }: ServicesManagerProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = editingId
      ? await updateService(editingId, formData)
      : await createService(formData);
    setLoading(false);
    if ("error" in result) {
      addToast("error", result.error);
    } else {
      addToast("success", editingId ? "Servizio aggiornato" : "Servizio creato");
      setShowForm(false);
      setEditingId(null);
      router.refresh();
    }
  }, [editingId, addToast, router]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setLoading(true);
    const result = await deleteService(deleteId);
    setLoading(false);
    setDeleteId(null);
    if ("error" in result) {
      addToast("error", result.error);
    } else {
      addToast("success", "Servizio eliminato");
      router.refresh();
    }
  }, [deleteId, addToast, router]);

  const editingService = editingId ? services.find((s) => s.id === editingId) : undefined;

  return (
    <>
      {!showForm && !editingId && (
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4" /> Nuovo servizio
        </Button>
      )}

      {(showForm || editingId) && (
        <form onSubmit={(e) => void handleSubmit(e)} className="max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">{editingId ? "Modifica servizio" : "Nuovo servizio"}</h2>
          <Input label="Nome" name="name" required defaultValue={editingService?.name ?? ""} />
          <Textarea label="Descrizione" name="description" defaultValue={editingService?.description ?? ""} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Durata (min)" name="duration_minutes" type="number" required min="1" defaultValue={String(editingService?.duration_minutes ?? 30)} />
            <Input label="Prezzo (€)" name="price" type="number" required step="0.01" min="0" defaultValue={editingService?.price.toFixed(2) ?? ""} />
          </div>
          <Input label="Ordinamento" name="sort_order" type="number" defaultValue={String(editingService?.sort_order ?? 0)} />
          <Checkbox label="Attivo" name="is_active" value="true" defaultChecked={editingService?.is_active ?? true} />
          <div className="flex gap-2">
            <Button type="submit" loading={loading}>{editingId ? "Aggiorna" : "Crea"}</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Annulla</Button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-gray-200 bg-white">
        {services.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">Nessun servizio configurato</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="flex items-center justify-between border-b border-gray-100 px-4 py-3 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{service.name}</p>
                <p className="text-xs text-gray-500">{service.duration_minutes} min — €{service.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={service.is_active ? "success" : "error"}>
                  {service.is_active ? "Attivo" : "Inattivo"}
                </Badge>
                <button type="button" onClick={() => setEditingId(service.id)} className="rounded p-1 text-gray-500 hover:bg-gray-200" aria-label="Modifica">
                  <Edit className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setDeleteId(service.id)} className="rounded p-1 text-red-500 hover:bg-red-50" aria-label="Elimina">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
        title="Elimina servizio"
        description="Sei sicuro di voler eliminare questo servizio?"
        confirmLabel="Elimina"
        danger
        loading={loading}
      />
    </>
  );
}

export { ServicesManager };
