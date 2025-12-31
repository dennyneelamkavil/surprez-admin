import { CategoryModel } from "@/server/models/category.model";
import { SubCategoryModel } from "@/server/models/subcategory.model";
import { ProductModel } from "@/server/models/product.model";

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-"); // remove duplicate hyphens
}

/**
 * Generate a unique slug for Category
 * Adds `-2`, `-3`, etc. ONLY if needed
 */
export async function generateUniqueCategorySlug(
  name: string,
  excludeId?: string
) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await CategoryModel.exists({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    })
  ) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

/**
 * Generate a unique slug for SubCategory
 * Adds `-2`, `-3`, etc. ONLY if needed
 */
export async function generateUniqueSubCategorySlug(
  name: string,
  excludeId?: string
) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await SubCategoryModel.exists({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    })
  ) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

/**
 * Generate a unique slug for Product
 * Adds `-2`, `-3`, etc. ONLY if needed
 */
export async function generateUniqueProductSlug(
  name: string,
  excludeId?: string
) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await ProductModel.exists({
      slug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    })
  ) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}
