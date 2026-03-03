import sys

content = open('app/(admin)/admin/products/actions.ts', encoding='utf-8').read()

# Fix specifications type
content = content.replace(
    'let specifications: Record<string, string> | null = null;\n  const specsStr = formData.get("specifications");\n  if (specsStr) {\n    try { specifications = JSON.parse(String(specsStr)); } catch { /* skip */ }\n  }',
    'let specifications: Record<string, unknown> | null = null;\n  const specsStr = formData.get("specifications");\n  if (specsStr) {\n    try { specifications = JSON.parse(String(specsStr)) as Record<string, unknown>; } catch { /* skip */ }\n  }'
)

# Fix insert - cast to any to bypass Supabase generated types for extra columns
content = content.replace(
    '    const { data, error } = await supabase\n      .from("products")\n      .insert({\n        ...parsed.data,\n        category_id,\n        specifications,\n        regulatory_info,\n        brand_id,\n      })',
    '    const { data, error } = await supabase\n      .from("products")\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      .insert({\n        ...parsed.data,\n        category_id,\n        specifications,\n        regulatory_info,\n        brand_id,\n      } as any)'
)

# Fix update - same cast
content = content.replace(
    '    const { error } = await supabase\n      .from("products")\n      .update({\n        ...parsed.data,\n        category_id,\n        specifications,\n        regulatory_info,\n        brand_id,\n      })',
    '    const { error } = await supabase\n      .from("products")\n      // eslint-disable-next-line @typescript-eslint/no-explicit-any\n      .update({\n        ...parsed.data,\n        category_id,\n        specifications,\n        regulatory_info,\n        brand_id,\n      } as any)'
)

open('app/(admin)/admin/products/actions.ts', 'w', encoding='utf-8').write(content)
print('Done')
