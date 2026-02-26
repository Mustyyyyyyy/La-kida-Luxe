const { z } = require("zod");

const productImage = z.object({
  url: z.string().url("Image url must be valid"),
  publicId: z.string().min(1, "publicId required"),
});

exports.createProductSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    category: z.string().optional().default("General"),
    price: z.number().nonnegative("Price must be >= 0"),
    description: z.string().optional().default(""),

    images: z.array(productImage).optional().default([]),

    sizes: z.array(z.string()).optional().default([]),
    colors: z.array(z.string()).optional().default([]),

    inStock: z.boolean().optional().default(true),
    stockQty: z.number().int().nonnegative().optional().default(0),
  }),
});

exports.updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    category: z.string().optional(),
    price: z.number().nonnegative().optional(),
    description: z.string().optional(),

    images: z.array(productImage).optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),

    inStock: z.boolean().optional(),
    stockQty: z.number().int().nonnegative().optional(),
  }),
});

exports.removeImageSchema = z.object({
  body: z.object({
    publicId: z.string().min(1, "publicId required"),
  }),
});