export const validateSchema = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log("ZOD ERROR:", result.error.format());
      const errors = result.error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      return res.status(400).json({ code: "invalid_schema", errors });
    }
  
    req.body = result.data;
    next();
  } catch (error) {
    return res.status(500).json({ code: "schema_validation_failed" });
  }
};
