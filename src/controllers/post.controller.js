import mongoose from "mongoose";
import postModel from "../models/post.model.js";
import commentModel from "../models/comment.model.js";

// Create Post
export const createPost = async (req, res) => {
  const { title, content, category, tags, isPublished } = req.body;

  const post = await postModel.create({
    title,
    content,
    category,
    tags,
    isPublished,
    author: req.user.id,
    coverImage: req.file ? req.file.path : undefined,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
};

// Get All Posts
export const getPosts = async (req, res) => {
  const {
    page = "1",
    limit = "10",
    search,
    category,
    author,
    sort = "-createdAt",
  } = req.query;

  // Convert pagination values to numbers
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  // Validate pagination values
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    !Number.isInteger(limitNumber) ||
    limitNumber < 1
  ) {
    return res.status(400).json({
      message: "Page and limit must be positive integers",
    });
  }

  // Prevent excessively large requests
  const safeLimit = Math.min(limitNumber, 100);

  // Allowed sorting fields
  const allowedSortFields = ["createdAt", "title", "category"];

  // Validate sort value
  if (typeof sort !== "string") {
    return res.status(400).json({
      message: "Invalid sort field",
    });
  }

  const sortField = sort.startsWith("-") ? sort.slice(1) : sort;

  if (!allowedSortFields.includes(sortField)) {
    return res.status(400).json({
      message: "Invalid sort field",
    });
  }

  // Determine sort direction
  const sortOrder = sort.startsWith("-") ? -1 : 1;

  // Build a safe sort object
  const safeSort = {
    [sortField]: sortOrder,
  };

  // Build filters
  const filter = {};

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        content: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (author) {
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        message: "Invalid author ID",
      });
    }

    filter.author = author;
  }

  // Calculate pagination offset
  const skip = (pageNumber - 1) * safeLimit;

  // Fetch posts
  const posts = await postModel
    .find(filter)
    .populate("author", "name email")
    .sort(safeSort)
    .skip(skip)
    .limit(safeLimit);

  // Get total number of matching posts
  const total = await postModel.countDocuments(filter);

  res.status(200).json({
    posts,
    pagination: {
      page: pageNumber,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  });
};

// Get Single Post
export const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid post ID",
    });
  }

  const post = await postModel.findById(id).populate("author", "name email");

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const comments = await commentModel
    .find({ post: id })
    .populate("user", "name email");

  res.status(200).json({
    post,
    comments,
  });
};

// Update Post
export const updatePost = async (req, res) => {
  const { id } = req.params;

  // Validate Post ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid post ID",
    });
  }

  const post = await postModel.findById(id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // Owner or Admin only
  const isOwner = post.author.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  // Update only fields that were provided
  const { title, content, category, tags, isPublished } = req.body;

  if (title !== undefined) {
    post.title = title;
  }

  if (content !== undefined) {
    post.content = content;
  }

  if (category !== undefined) {
    post.category = category;
  }

  if (tags !== undefined) {
    post.tags = tags;
  }

  if (isPublished !== undefined) {
    post.isPublished = isPublished;
  }

  // Update cover image if a new one was uploaded
  if (req.file) {
    post.coverImage = req.file.path;
  }

  await post.save();

  res.status(200).json({
    message: "Post updated successfully",
    post,
  });
};

// Delete Post
export const deletePost = async (req, res) => {
  const { id } = req.params;

  // Validate Post ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid post ID",
    });
  }

  const post = await postModel.findById(id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  // Owner or Admin only
  const isOwner = post.author.toString() === req.user.id;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await postModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Post deleted successfully",
  });
};
