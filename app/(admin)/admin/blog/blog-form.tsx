"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/components/ui/toast";
import { slugify } from "@/lib/utils/slugify";
import type { BlogPost } from "@/types/database";

interface BlogFormProps {
  post?: BlogPost;
  action: (formData: FormData) => Promise<{ success: boolean } | { error: string }>;
}

function BlogForm({ post, action }: BlogFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [richContent, setRichContent] = useState(post?.rich_content ?? "");
  const [slugValue, setSlugValue] = useState(post?.slug ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("rich_content", richContent);
    formData.set("slug", slugValue);
    formData.set("cover_image_url", coverUrl);
    formData.set("tags", tags);
    const result = await action(formData);
    setLoading(false);
    if ("error" in result) addToast("error", result.error);
    else { addToast("success", post ? "Post aggiornato" : "Post creato"); router.push("/admin/blog"); }
  }, [action, richContent, slugValue, coverUrl, tags, addToast, router, post]);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Input label="Titolo" name="title" required defaultValue={post?.title ?? ""}
            onChange={(e) => { if (!post) setSlugValue(slugify(e.target.value)); }} />
          <Input label="Slug" name="slug" required value={slugValue} onChange={(e) => setSlugValue(e.target.value)} />
          <Textarea label="Estratto" name="excerpt" defaultValue={post?.excerpt ?? ""} maxLength={300} showCount />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contenuto</label>
            <RichTextEditor value={richContent} onChange={setRichContent} placeholder="Scrivi il contenuto..." />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Immagine di copertina</label>
            <ImageUpload value={coverUrl} onChange={setCoverUrl} onClear={() => setCoverUrl("")} folder="blog" />
          </div>
          <Input label="Tags (separati da virgola)" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} description="es: novità, offerte, tutorial" />
          <Checkbox label="Pubblicato" name="is_published" value="true" defaultChecked={post?.is_published ?? false} />
          <h3 className="pt-4 text-lg font-semibold text-gray-900">SEO</h3>
          <Input label="Titolo SEO" name="seo_title" defaultValue={post?.seo_title ?? ""} />
          <Textarea label="Descrizione SEO" name="seo_description" defaultValue={post?.seo_description ?? ""} maxLength={160} showCount />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" type="button" onClick={() => router.back()}>Annulla</Button>
        <Button type="submit" loading={loading}>{post ? "Aggiorna" : "Pubblica"}</Button>
      </div>
    </form>
  );
}

export { BlogForm };
