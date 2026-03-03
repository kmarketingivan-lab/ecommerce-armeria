content = open('components/admin/image-manager.tsx', encoding='utf-8').read()

old = """    const updated = images.filter((i) => i.id !== image.id);
    // if deleted was primary, set first as primary
    if (image.is_primary && updated.length > 0) {
      await setProductImagePrimary(productId, updated[0].id);
      updated[0].is_primary = true;
    }
    setImages(updated);"""

new = """    const updated = images.filter((i) => i.id !== image.id);
    // if deleted was primary, set first as primary
    const first = updated[0];
    if (image.is_primary && first) {
      await setProductImagePrimary(productId, first.id);
      first.is_primary = true;
    }
    setImages(updated);"""

if old in content:
    content = content.replace(old, new)
    open('components/admin/image-manager.tsx', 'w', encoding='utf-8').write(content)
    print('Fixed handleDelete')
else:
    print('Pattern not found! Showing context:')
    idx = content.find('if (image.is_primary && updated.length > 0)')
    print(repr(content[idx-200:idx+200]))
