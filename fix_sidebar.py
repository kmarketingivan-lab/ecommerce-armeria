import sys

content = open('app/(admin)/admin/vetrina/actions.ts', encoding='utf-8').read()

content = content.replace(
    'return (data ?? []) as HeroSlide[];',
    'return (data ?? []) as unknown as HeroSlide[];'
)

open('app/(admin)/admin/vetrina/actions.ts', 'w', encoding='utf-8').write(content)
print('Done')
