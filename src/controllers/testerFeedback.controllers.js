import testersPostModel from "../models/testersPost.model.js";
import { cloudinary } from "../config/cloudinary.js";

// Crear nuevo post
export const createFeedbackPost = async (req, res) => {
  try {
    const { title, description, urgency } = req.body;
    //const mediaUrls = req.files?.map((file) => file.path); // Cloudinary URLs

    const userId = req.user.id;

    const uploadedMedia = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto", // permite subir imagen o video
          folder: "feedback-posts",
        });

        uploadedMedia.push({
          url: result.secure_url,
          public_id: result.public_id,
          type: result.resource_type,
        });
      }
    }

    const newPost = new testersPostModel({
      title,
      description,
      urgency,
      user: userId,
      media: uploadedMedia,
    });

    await newPost.save();
    res.status(201).json({ code: "feedback.submitted", post: newPost });
  } catch (error) {
    console.error("Error al crear el feedback:", error);
    res.status(500).json({ code: "feedback.error" });
  }
};

// Obtener los posts del tester autenticado
export const getMyFeedbackPosts = async (req, res) => {
  try {
    const posts = await testersPostModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ code: "feedback_posts_fetched", posts });
  } catch (err) {
    res.status(500).json({ code: "error_fetching_feedback_posts" });
  }
};

// Obtener todos los posts (admin)
export const getAllFeedbackPosts = async (req, res) => {
  try {
    const posts = await testersPostModel.find().populate("user", "email");
    res.json({ code: "all_feedback_posts_fetched", posts });
  } catch (err) {
    console.error("Error al obtener posts de feedback:", err); // 👈 clave
    res.status(500).json({ code: "error_fetching_all_feedback_posts" });
  }
};

// Cambiar el estado de un post
export const updatePostStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await testersPostModel.findByIdAndUpdate(
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
    const post = await testersPostModel
      .findById(req.params.id)
      .populate("comments.user", "name");

    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    if (
      req.user.role === "tester"  &&
      !post.user?.equals(req.user.id)
    ) {
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
    const post = await testersPostModel.findById(req.params.id);

    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });

    if (
      req.user.role !== "admin" &&
      post.user.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ code: "unauthorized_comment" });
    }

    post.comments.push({ user: req.user.id, text: message });
    await post.save();

    res.json({ code: "feedback_comment_added", post });
  } catch (err) {
    res.status(500).json({ code: "error_adding_comment", error: err.message });
  }
};

// Actualizar post
export const updateFeedbackPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await testersPostModel.findOne({ _id: id, user: userId });
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
    const userId = req.user.id;

    console.log(id, userId);

    const post = await testersPostModel.findOne({ _id: id, user: userId });
    if (!post) return res.status(404).json({ code: "feedback_post_not_found" });
    console.log(post);

    // Borrar archivos de Cloudinary
    for (const file of post.media) {
      await cloudinary.uploader.destroy(file.public_id, {
        resource_type: file.type, // "image" o "video"
      });
    }

    await testersPostModel.findByIdAndDelete(id);
    res.status(200).json({ code: "feedback_post_deleted" });
  } catch (error) {
    console.error("Error al eliminar feedback:", error);
    res.status(500).json({ code: "error_deleting_feedback_post" });
  }
};

// Eliminar comentario
export const deleteFeedbackComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await testersPostModel.findById(postId);
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
