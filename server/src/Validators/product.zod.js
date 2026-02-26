const { z } = require("zod");

const imageSchema = z.object({
  url: z.string().url("Invalid image url"),
  publicId: z.string().min(1, "publicId is required"),
});

exports.createProductSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    price: z.number().nonnegative("Price must be >= 0"),
    category: z.string().optional().default("General"),
    description: z.string().optional().default(""),
    images: z.array(imageSchema).optional().default([]),

    sizes: z.array(z.string()).optional().default([]),
    colors: z.array(z.string()).optional().default([]),

    stockQty: z.number().int().nonnegative().optional().default(0),
    inStock: z.boolean().optional().default(true),
  }),
});

exports.updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Missing id"),
  }),
  body: z
    .object({
      title: z.string().min(2).optional(),
      price: z.number().nonnegative().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
      images: z.array(imageSchema).optional(),

      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),

      stockQty: z.number().int().nonnegative().optional(),
      inStock: z.boolean().optional(),
    })
    .strict()
    .partial(),
});

exports.removeProductImageSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Missing id"),
  }),
  body: z.object({
    publicId: z.string().min(1, "publicId is required"),
  }),
});