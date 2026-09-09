import Joi from "joi";

// Create Post
export const postSchema = Joi.object({
  title: Joi.string().min(5).required(),
  content: Joi.string().min(10).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean(),
});

// Update Post
export const updatePostSchema = Joi.object({
  title: Joi.string().min(5),
  content: Joi.string().min(10),
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean(),
}).min(1);
