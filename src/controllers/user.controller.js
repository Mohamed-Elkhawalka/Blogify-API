import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

// Get all users
export const getUsers = async (req, res) => {
  const users = await userModel.find().select("-password");

  res.status(200).json({
    users,
  });
};

// Get single user
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = await userModel.findById(id).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    user,
  });
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (req.user.id !== id && req.user.role !== "admin") {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const { name, email, password } = req.body;

  if (name !== undefined) {
    user.name = name;
  }

  if (email !== undefined) {
    user.email = email;
  }

  if (password !== undefined) {
    user.password = bcrypt.hashSync(password, 8);
  }

  if (req.file) {
    user.avatar = req.file.path;
  }

  await user.save();

  const updatedUser = await userModel.findById(id).select("-password");

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
    });
  }

  const user = await userModel.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    message: "User deleted successfully",
  });
};
