import os
import glob

# All admin action files
files = glob.glob('app/(admin)/admin/**/actions.ts', recursive=True)
files.append('app/(admin)/admin/products/image-actions.ts')

for filepath in files:
    if not os.path.exists(filepath):
        continue

    content = open(filepath, encoding='utf-8').read()

    # Skip if already uses adminClient
    if 'createAdminClient' in content:
        print(f'SKIP (already updated): {filepath}')
        continue

    # Replace import
    content = content.replace(
        'import { createClient } from "@/lib/supabase/server";',
        'import { createAdminClient } from "@/lib/supabase/admin";'
    )

    # Replace usage - await createClient() -> createAdminClient()
    content = content.replace(
        'await createClient()',
        'createAdminClient()'
    )
    # Also handle: const supabase = await createClient();
    content = content.replace(
        'const supabase = createAdminClient()',
        'const supabase = createAdminClient()'
    )

    open(filepath, 'w', encoding='utf-8').write(content)
    print(f'Updated: {filepath}')

print('Done')
