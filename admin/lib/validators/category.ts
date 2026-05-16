import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),

  image: z.string().optional(),

  parentId: z.string().optional(),
});

export type CategoryFormValues = z.input<typeof categorySchema>;
export type CategorySubmitValues = z.output<typeof categorySchema>;
