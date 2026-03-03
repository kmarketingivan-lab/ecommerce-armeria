import os, re

BASE = r"C:\Users\cresc\Projects\my-ecommerce-v2"

FILES = [
    r"app\(storefront)\account\layout.tsx",
    r"app\(storefront)\blog\loading.tsx",
    r"app\(storefront)\blog\page.tsx",
    r"app\(storefront)\contatti\page.tsx",
    r"app\(storefront)\products\loading.tsx",
    r"app\(storefront)\products\page.tsx",
    r"components\layout\storefront-footer.tsx",
    r"components\layout\storefront-header.tsx",
    r"components\storefront\brand-carousel.tsx",
    r"components\storefront\hero-slider.tsx",
    r"components\storefront\newsletter-form.tsx",
    r"components\storefront\recently-viewed.tsx",
    r"components\storefront\trust-badges.tsx",
]

REPLACEMENTS = [
    (r'mx-auto flex max-w-7xl items-center justify-between px-4 py-(\d+)', r'container-fluid flex items-center justify-between py-\1'),
    (r'mx-auto max-w-7xl px-4 py-(\d+) sm:px-6 lg:px-8', r'container-fluid py-\1'),
    (r'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', 'container-fluid'),
    (r'mx-auto max-w-7xl px-4', 'container-fluid'),
]

total = 0
for rel_path in FILES:
    full_path = os.path.join(BASE, rel_path)
    if not os.path.exists(full_path):
        print(f"SKIP: {rel_path}")
        continue
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for pattern, replacement in REPLACEMENTS:
        content = re.sub(pattern, replacement, content)
    if content != original:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"UPDATED: {rel_path}")
        total += 1
    else:
        print(f"no change: {rel_path}")

print(f"\nDone. {total} files updated.")
