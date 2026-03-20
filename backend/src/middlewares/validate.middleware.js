const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
// If validation fails, return a 400 response with error details
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }
// If validation succeeds, attach the validated data to the request object and proceed
  req.validatedBody = result.data;
  return next();
};

export { validate };
