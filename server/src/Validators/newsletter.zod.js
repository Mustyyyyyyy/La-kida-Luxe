const { z } = require("zod");

exports.subscribeSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
  }),
});