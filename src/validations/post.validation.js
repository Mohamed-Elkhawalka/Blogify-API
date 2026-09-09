import Joi from "joi";

export const postSchema = Joi.object({
title: Joi.string().min(5).required(),
content: Joi.string().min(10).required(),
category: Joi.string().required(),
});
