const { z } = require("zod");

const orderItem = z.object({
  productId: z.string().optional(), // Mongo id string
  title: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().min(1),
  size: z.string().optional().default(""),
  color: z.string().optional().default(""),
  image: z.string().optional().default(""),
});

const measurements = z.object({
  chest: z.string().optional(),
  waist: z.string().optional(),
  hip: z.string().optional(),
  shoulder: z.string().optional(),
  sleeve: z.string().optional(),
  inseam: z.string().optional(),
  length: z.string().optional(),
  neck: z.string().optional(),
  notes: z.string().optional(),
});

exports.createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().min(2, "Customer name required"),
      phone: z.string().min(6, "Phone required"),
      email: z.string().email().optional().or(z.literal("")).default(""),
    }),

    delivery: z.object({
      address: z.string().min(5, "Delivery address required"),
      city: z.string().optional().default(""),
      state: z.string().optional().default(""),
      method: z.enum(["standard", "express", "pickup"]).optional().default("standard"),
    }),

    items: z.array(orderItem).optional().default([]),

    isCustom: z.boolean().optional().default(false),
    custom: z
      .object({
        styleType: z.string().optional().default(""),
        fabric: z.string().optional().default(""),
        measurements: measurements.optional().default({}),
        referenceImages: z.array(z.string().url()).optional().default([]),
        specialInstructions: z.string().optional().default(""),
      })
      .optional()
      .default({}),

    subtotal: z.number().nonnegative().optional().default(0),
    deliveryFee: z.number().nonnegative().optional().default(0),
    total: z.number().nonnegative().optional().default(0),
  }),
});

exports.updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"]),
  }),
});