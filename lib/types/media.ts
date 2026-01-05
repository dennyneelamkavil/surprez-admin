export interface Media {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}

export type MediaFolder =
  | "categories"
  | "subcategories"
  | "products/covers"
  | "products/images"
  | "products/videos";
