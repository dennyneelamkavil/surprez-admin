import "server-only";

export type MediaFolder =
  | "categories"
  | "subcategories"
  | "products/covers"
  | "products/images"
  | "products/videos";

export type MediaResourceType = "image" | "video";

export type Media = {
  url: string;
  publicId: string;
  resourceType: MediaResourceType;
};
