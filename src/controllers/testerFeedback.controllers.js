import FeedbackPost from "../models/FeedbackPost.js";

// Crear nuevo post
export const createFeedbackPost = async (req, res) => {
  try {
    const { title, description, urgency, media } = req.body;
    const newPost = new FeedbackPost({
      user: req.user._id,
      title,
      description,
      urgency,
      media,
    });
    await newPost.save();
    res.status(201).json({ code: "feedback_post_created", post: newPost });
  } catch (err) {
    res.status(500).json({ code: "error_creating_feedback_post" });
  }
};

// Obtener los posts del tester autenticado
export const getMyFeedbackPosts = async (req, res) => {
  try {
    const posts = await FeedbackPost.find({ user: req.user._id });
    res.json({ code: "feedback_posts_fetched", posts });
  } catch (err) {
    res.status(500).json({ code: "error_fetching_feedback_posts" });
  }
};

// Obtener todos los posts (admin)
export const getAllFeedbackPosts = async (req, res) => {
  try {
    const posts = await FeedbackPost.find().populate("user", "email");
    res.json({ code: "all_feedback_posts_fetched", posts });
  } catch (err) {
    res.status(500).json({ code: "error_fetching_all_feedback_posts" });
  }
};

// Cambiar el estado de un post
export const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await FeedbackPost.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ code: "feedback_post_status_updated", post: updated });
  } catch (err) {
    res.status(500).json({ code: "error_updating_status" });
  }
};

// Obtener post con comentarios
export const getFeedbackPostById = async (req, res) => {
  try {
    const post = await FeedbackPost.findById(req.params.id).populate("comments.user", "email");

    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    if (req.user.role !== "admin" && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ code: "unauthorized_access" });
    }

    res.json({ code: "feedback_post_fetched", post });
  } catch (err) {
    res.status(500).json({ code: "error_fetching_feedback_post" });
  }
};

// Agregar comentario
export const addFeedbackComment = async (req, res) => {
  try {
    const { message } = req.body;
    const post = await FeedbackPost.findById(req.params.id);

    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    if (req.user.role !== "admin" && post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ code: "unauthorized_comment" });
    }

    post.comments.push({ user: req.user._id, message });
    await post.save();

    res.json({ code: "feedback_comment_added", post });
  } catch (err) {
    res.status(500).json({ code: "error_adding_comment" });
  }
};

// Actualizar post
export const updateFeedbackPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await FeedbackPost.findOne({ _id: id, user: userId });
    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    const { title, description, urgency, status, media } = req.body;

    post.title = title || post.title;
    post.description = description || post.description;
    post.urgency = urgency || post.urgency;
    post.status = status || post.status;
    post.media = media || post.media;

    await post.save();

    res.status(200).json({ code: "feedback_post_updated", post });
  } catch (error) {
    res.status(500).json({ code: "error_updating_feedback_post" });
  }
};

// Eliminar post
export const deleteFeedbackPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await FeedbackPost.findOne({ _id: id, user: userId });
    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    await FeedbackPost.findByIdAndDelete(id);
    res.status(200).json({ code: "feedback_post_deleted" });
  } catch (error) {
    res.status(500).json({ code: "error_deleting_feedback_post" });
  }
};

// Eliminar comentario
export const deleteFeedbackComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await FeedbackPost.findById(postId);
    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ code: "comment_not_found" });

    if (comment.user.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ code: "unauthorized_delete_comment" });
    }

    comment.remove();
    await post.save();

    res.status(200).json({ code: "comment_deleted" });
  } catch (error) {
    res.status(500).json({ code: "error_deleting_comment" });
  }
};
