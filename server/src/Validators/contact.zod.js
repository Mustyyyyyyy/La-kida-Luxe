const { z } = require("zod");

exports.sendContactSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")).default(""),
    phone: z.string().optional().or(z.literal("")).default(""),
    message: z.string().min(5, "Message is too short"),
  }),
});