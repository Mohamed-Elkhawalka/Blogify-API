export const validate = (schema, type = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details,
      });
    }

    next();
  };
};
