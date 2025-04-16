import axios from "./axios";

export const createFeedbackPostRequest = (formData, token) =>
  axios.post("/tester-feedback", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMyFeedbackPostsRequest = (token) =>
  axios.get("/tester-feedback/mine", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export const getAllFeedbackPostsRequest = (token) =>
  axios.get("/tester-feedback", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getFeedbackPostRequest = (id, token) =>
  axios.get(`/tester-feedback/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateFeedbackPostRequest = (post, token) =>
  axios.put(`/tester-feedback/${post._id}`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteFeedbackPostRequest = (id, token) =>
  axios.delete(`/tester-feedback/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteFeedbackCommentRequest = (postId, commentId, token) =>
  axios.delete(`/tester-feedback/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addFeedbackCommentRequest = (postId, message, token) =>
  axios.post(
    `/tester-feedback/${postId}/comment`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
