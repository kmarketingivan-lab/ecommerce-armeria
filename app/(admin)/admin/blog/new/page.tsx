import { requireAdmin } from "@/lib/auth/helpers";
import { BlogForm } from "../blog-form";
import { createPost } from "../actions";

export default async function NewBlogPostPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nuovo post</h1>
      <BlogForm action={createPost} />
    </div>
  );
}
