import "server-only";
import { z } from "zod";

export const MediaValidation = z.object({
  url: z.string().url(),
  publicId: z.string(),
  resourceType: z.enum(["image", "video"]),
});
