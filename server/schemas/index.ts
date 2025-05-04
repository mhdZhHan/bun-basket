import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
  price: z.coerce.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type Product = z.infer<typeof productSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;
