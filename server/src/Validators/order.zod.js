const { z } = require("zod");

const orderItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  title: z.string().min(1, "title is required"),
  price: z.number().nonnegative("price must be >= 0"),
  qty: z.number().int().min(1, "qty must be >= 1"),

  size: z.string().optional().default(""),
  color: z.string().optional().default(""),
});

exports.createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      fullName: z.string().min(2, "Full name required"),
      phone: z.string().min(6, "Phone required"),
      email: z.string().email("Invalid email").optional().or(z.literal("")).default(""),
    }),

    delivery: z
      .object({
        method: z.enum(["delivery", "pickup"]).default("delivery"),
        address: z.string().optional().default(""),
        city: z.string().optional().default(""),
        state: z.string().optional().default(""),
        note: z.string().optional().default(""),
      })
      .optional()
      .default({ method: "delivery", address: "", city: "", state: "", note: "" }),

    items: z.array(orderItemSchema).min(1, "At least one item required"),

    subtotal: z.number().nonnegative().optional().default(0),
    deliveryFee: z.number().nonnegative().optional().default(0),
    total: z.number().nonnegative().optional().default(0),

    status: z
      .enum(["pending_whatsapp", "confirmed", "in_progress", "ready", "delivered", "cancelled"])
      .optional()
      .default("pending_whatsapp"),
  }),
});

exports.updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Missing id"),
  }),
  body: z.object({
    status: z.enum([
      "pending_whatsapp",
      "confirmed",
      "in_progress",
      "ready",
      "delivered",
      "cancelled",
    ]),
  }),
});