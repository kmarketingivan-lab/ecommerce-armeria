-- ============================================
-- Migration 0013: Fix RLS infinite recursion
-- All policies that check admin via subquery on
-- profiles cause 42P17. Fix: SECURITY DEFINER function.
-- ============================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================
-- PROFILES
-- ============================================
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON profiles;
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Role protection via trigger instead of recursive subquery
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can update any profile" ON profiles
  FOR UPDATE USING (is_admin());

-- Trigger to prevent non-admin from changing their own role
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT is_admin() THEN
      RAISE EXCEPTION 'Only admins can change roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_role_change_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_change();

-- ============================================
-- CATEGORIES
-- ============================================
DROP POLICY IF EXISTS "Admin can view all categories" ON categories;
DROP POLICY IF EXISTS "Admin can insert categories" ON categories;
DROP POLICY IF EXISTS "Admin can update categories" ON categories;
DROP POLICY IF EXISTS "Admin can delete categories" ON categories;

CREATE POLICY "Admin can view all categories" ON categories FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert categories" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update categories" ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete categories" ON categories FOR DELETE USING (is_admin());
-- ============================================
-- PRODUCTS
-- ============================================
DROP POLICY IF EXISTS "Admin can view all products" ON products;
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

CREATE POLICY "Admin can view all products" ON products FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert products" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update products" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete products" ON products FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCT_IMAGES
-- ============================================
DROP POLICY IF EXISTS "Admin can insert product images" ON product_images;
DROP POLICY IF EXISTS "Admin can update product images" ON product_images;
DROP POLICY IF EXISTS "Admin can delete product images" ON product_images;

CREATE POLICY "Admin can insert product images" ON product_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update product images" ON product_images FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete product images" ON product_images FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCT_VARIANTS
-- ============================================
DROP POLICY IF EXISTS "Admin can view all variants" ON product_variants;
DROP POLICY IF EXISTS "Admin can insert variants" ON product_variants;
DROP POLICY IF EXISTS "Admin can update variants" ON product_variants;
DROP POLICY IF EXISTS "Admin can delete variants" ON product_variants;
CREATE POLICY "Admin can view all variants" ON product_variants FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert variants" ON product_variants FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update variants" ON product_variants FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete variants" ON product_variants FOR DELETE USING (is_admin());

-- ============================================
-- ORDERS
-- ============================================
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can insert orders" ON orders;
DROP POLICY IF EXISTS "Admin can update orders" ON orders;

CREATE POLICY "Admin can view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert orders" ON orders FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update orders" ON orders FOR UPDATE USING (is_admin());

-- ORDER_ITEMS
DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;

CREATE POLICY "Admin can view all order items" ON order_items FOR SELECT USING (is_admin());

-- ============================================
-- PAGES
-- ============================================
DROP POLICY IF EXISTS "Admin can view all pages" ON pages;
DROP POLICY IF EXISTS "Admin can insert pages" ON pages;
DROP POLICY IF EXISTS "Admin can update pages" ON pages;
DROP POLICY IF EXISTS "Admin can delete pages" ON pages;

CREATE POLICY "Admin can view all pages" ON pages FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert pages" ON pages FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update pages" ON pages FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete pages" ON pages FOR DELETE USING (is_admin());
-- ============================================
-- BLOG_POSTS
-- ============================================
DROP POLICY IF EXISTS "Admin can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin can delete blog posts" ON blog_posts;

CREATE POLICY "Admin can view all blog posts" ON blog_posts FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert blog posts" ON blog_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update blog posts" ON blog_posts FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete blog posts" ON blog_posts FOR DELETE USING (is_admin());

-- ============================================
-- BOOKING_SERVICES
-- ============================================
DROP POLICY IF EXISTS "Admin can view all booking services" ON booking_services;
DROP POLICY IF EXISTS "Admin can insert booking services" ON booking_services;
DROP POLICY IF EXISTS "Admin can update booking services" ON booking_services;
DROP POLICY IF EXISTS "Admin can delete booking services" ON booking_services;

CREATE POLICY "Admin can view all booking services" ON booking_services FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert booking services" ON booking_services FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update booking services" ON booking_services FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete booking services" ON booking_services FOR DELETE USING (is_admin());
-- ============================================
-- BOOKING_AVAILABILITY
-- ============================================
DROP POLICY IF EXISTS "Admin can view all availability" ON booking_availability;
DROP POLICY IF EXISTS "Admin can insert availability" ON booking_availability;
DROP POLICY IF EXISTS "Admin can update availability" ON booking_availability;
DROP POLICY IF EXISTS "Admin can delete availability" ON booking_availability;

CREATE POLICY "Admin can view all availability" ON booking_availability FOR SELECT USING (is_admin());
CREATE POLICY "Admin can insert availability" ON booking_availability FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can update availability" ON booking_availability FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete availability" ON booking_availability FOR DELETE USING (is_admin());

-- ============================================
-- BOOKINGS
-- ============================================
DROP POLICY IF EXISTS "Admin can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can delete bookings" ON bookings;

CREATE POLICY "Admin can view all bookings" ON bookings FOR SELECT USING (is_admin());
CREATE POLICY "Admin can update bookings" ON bookings FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can delete bookings" ON bookings FOR DELETE USING (is_admin());

-- ============================================
-- SITE_SETTINGS
-- ============================================
DROP POLICY IF EXISTS "Admin can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admin can insert site settings" ON site_settings;

CREATE POLICY "Admin can update site settings" ON site_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Admin can insert site settings" ON site_settings FOR INSERT WITH CHECK (is_admin());

-- ============================================
-- MEDIA
-- ============================================
DROP POLICY IF EXISTS "Admin can insert media" ON media;
DROP POLICY IF EXISTS "Admin can delete media" ON media;

CREATE POLICY "Admin can insert media" ON media FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin can delete media" ON media FOR DELETE USING (is_admin());

-- ============================================
-- AUDIT_LOG
-- ============================================
DROP POLICY IF EXISTS "Admin can view audit logs" ON audit_log;

CREATE POLICY "Admin can view audit logs" ON audit_log FOR SELECT USING (is_admin());