"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { updateSettings } from "./actions";

interface SettingsFormProps {
  settings: Record<string, unknown>;
}

function SettingsForm({ settings }: SettingsFormProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const entries: { key: string; value: unknown }[] = [
      { key: "site_name", value: formData.get("site_name") ?? "" },
      { key: "site_description", value: formData.get("site_description") ?? "" },
      { key: "contact_email", value: formData.get("contact_email") ?? "" },
      { key: "contact_phone", value: formData.get("contact_phone") ?? "" },
      { key: "address", value: {
        street: formData.get("address_street") ?? "",
        city: formData.get("address_city") ?? "",
        zip: formData.get("address_zip") ?? "",
        country: formData.get("address_country") ?? "IT",
      }},
      { key: "social_links", value: {
        facebook: formData.get("social_facebook") ?? "",
        instagram: formData.get("social_instagram") ?? "",
        twitter: formData.get("social_twitter") ?? "",
      }},
      { key: "currency", value: formData.get("currency") ?? "EUR" },
      { key: "tax_rate", value: Number(formData.get("tax_rate") ?? 22) },
    ];

    const result = await updateSettings(entries);
    setLoading(false);
    if ("error" in result) addToast("error", result.error);
    else addToast("success", "Impostazioni salvate");
  }, [addToast]);

  const getStr = (key: string): string => {
    const val = settings[key];
    return typeof val === "string" ? val : "";
  };

  const getObj = (key: string): Record<string, string> => {
    const val = settings[key];
    return (typeof val === "object" && val !== null) ? val as Record<string, string> : {};
  };

  const address = getObj("address");
  const social = getObj("social_links");

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-8">
      {/* General */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Generale</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Nome sito" name="site_name" defaultValue={getStr("site_name")} />
          <Textarea label="Descrizione sito" name="site_description" defaultValue={getStr("site_description")} />
          <Input label="Email contatto" name="contact_email" type="email" defaultValue={getStr("contact_email")} />
          <Input label="Telefono" name="contact_phone" type="tel" defaultValue={getStr("contact_phone")} />
        </div>
      </section>

      {/* Address */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Indirizzo</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Via" name="address_street" defaultValue={address.street ?? ""} />
          <Input label="Città" name="address_city" defaultValue={address.city ?? ""} />
          <Input label="CAP" name="address_zip" defaultValue={address.zip ?? ""} />
          <Input label="Paese" name="address_country" defaultValue={address.country ?? "IT"} />
        </div>
      </section>

      {/* Social */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Social</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <Input label="Facebook" name="social_facebook" type="url" defaultValue={social.facebook ?? ""} />
          <Input label="Instagram" name="social_instagram" type="url" defaultValue={social.instagram ?? ""} />
          <Input label="Twitter/X" name="social_twitter" type="url" defaultValue={social.twitter ?? ""} />
        </div>
      </section>

      {/* Business */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Business</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <Input label="Valuta" name="currency" defaultValue={getStr("currency") || "EUR"} />
          <Input label="Aliquota IVA (%)" name="tax_rate" type="number" min="0" max="100" step="0.01"
            defaultValue={String(typeof settings["tax_rate"] === "number" ? settings["tax_rate"] : 22)} />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={loading}>Salva impostazioni</Button>
      </div>
    </form>
  );
}

export { SettingsForm };
