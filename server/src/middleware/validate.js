// Generic Zod validation middleware
exports.validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }

    // Optional: attach parsed data (cleaned)
    req.validated = result.data;

    next();
  } catch (e) {
    return res.status(400).json({ message: "Invalid request" });
  }
};