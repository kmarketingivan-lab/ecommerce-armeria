"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createOrder } from "@/lib/checkout/actions";

interface CheckoutFormProps {
  userEmail: string;
}

/**
 * Checkout form with shipping/billing address, notes, and submit.
 */
function CheckoutForm({ userEmail }: CheckoutFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sameBilling, setSameBilling] = useState(true);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    // If billing = shipping, remove billing fields so server action skips them
    if (sameBilling) {
      formData.delete("billing_street");
      formData.delete("billing_city");
      formData.delete("billing_zip");
      formData.delete("billing_province");
      formData.delete("billing_country");
    }

    const result = await createOrder(formData);
    setLoading(false);

    if ("error" in result) {
      addToast("error", result.error);
    } else {
      router.push(`/checkout/success?order=${result.orderNumber}`);
    }
  }, [addToast, router, sameBilling]);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      {/* Customer info */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Dati cliente</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome" name="customer_name" required />
          <Input label="Email" name="email" type="email" required defaultValue={userEmail} />
          <Input label="Telefono" name="customer_phone" type="tel" />
        </div>
      </section>

      {/* Shipping address */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Indirizzo di spedizione</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Via" name="shipping_street" required />
          </div>
          <Input label="Città" name="shipping_city" required />
          <Input label="CAP" name="shipping_zip" required />
          <Input label="Provincia" name="shipping_province" />
          <Input label="Paese" name="shipping_country" required defaultValue="IT" />
        </div>
      </section>

      {/* Billing address */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <Checkbox
          label="Indirizzo di fatturazione uguale a spedizione"
          name="same_billing"
          value="true"
          defaultChecked={true}
          onChange={(e) => setSameBilling(e.target.checked)}
        />

        {!sameBilling && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Via" name="billing_street" required />
            </div>
            <Input label="Città" name="billing_city" required />
            <Input label="CAP" name="billing_zip" required />
            <Input label="Provincia" name="billing_province" />
            <Input label="Paese" name="billing_country" required defaultValue="IT" />
          </div>
        )}
      </section>

      {/* Notes */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <Textarea label="Note (opzionale)" name="notes" placeholder="Istruzioni speciali per la consegna..." />
      </section>

      <Button type="submit" loading={loading} className="w-full">
        Conferma ordine
      </Button>
    </form>
  );
}

export { CheckoutForm };
