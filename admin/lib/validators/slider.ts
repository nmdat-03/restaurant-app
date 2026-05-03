import { z } from "zod";

export const sliderSchema = z.object({
  image: z.object({
    url: z.string().min(1, "Image is required"),
    publicId: z.string().optional(),
  }),

  link: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.startsWith("/") || val.startsWith("http"), {
      message: "Link must be internal (/) or external (http)",
    }),

  sortOrder: z.preprocess(
    (val) => (val === "" ? 0 : Number(val)),
    z.number().min(0, "Sort order cannot be negative"),
  ),

  isActive: z.boolean().default(true),
});

export type SliderFormValues = z.input<typeof sliderSchema>;
export type SliderSubmitValues = z.output<typeof sliderSchema>;

export const sliderUpdateSchema = sliderSchema.partial();
