/**
 * Strips undefined values from an object for Supabase compatibility.
 * Zod's .nullish() produces T | null | undefined but Supabase Insert/Update
 * types only accept T | null under exactOptionalPropertyTypes.
 * This function removes keys with undefined values at runtime.
 */
export function stripUndefined<T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T]: Exclude<T[K], undefined> } {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as { [K in keyof T]: Exclude<T[K], undefined> };
}
