export interface Role {
  id: string;
  name: string;
  isSuperAdmin: boolean;
  permissions: string[];
}

export interface Media {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
}
