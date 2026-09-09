import commentModel from "../models/comment.model.js";
import postModel from "../models/post.model.js";

// Create comment
export const createComment = async (req, res) => {
const { text } = req.body;
const { postId } = req.params;

const post = await postModel.findById(postId);

if (!post) {
return res.status(404).json({
message: "Post not found",
});
}

const comment = await commentModel.create({
text,
user: req.user.id,
post: postId,
});

res.status(201).json({
message: "Comment created successfully",
comment,
});
};

// Delete comment
export const deleteComment = async (req, res) => {
const { id } = req.params;

const comment = await commentModel.findById(id);

if (!comment) {
return res.status(404).json({
message: "Comment not found",
});
}

if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
return res.status(403).json({
message: "Forbidden",
});
}

await commentModel.findByIdAndDelete(id);

res.status(200).json({
message: "Comment deleted successfully",
});
};
