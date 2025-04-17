import React, { useState } from "react";
import { X } from "lucide-react";
import {
  addFeedbackCommentRequest,
  getFeedbackPostRequest,
} from "../../api/testerFeedback";
import { useAuth } from "../../context/AuthContext.jsx";
import { FileText, MessageCircle } from "lucide-react";
import useWindowSize from "../../hooks/useWindowSize.jsx";

export default function CardFeedback({ post, handleDeletePost }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const { user } = useAuth();

  const { width } = useWindowSize();

  const fetchComments = async () => {
    try {
      const session = { token: localStorage.getItem("token") };
      const res = await getFeedbackPostRequest(post._id, session.token);
      setComments(res.data.post.comments);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const handleClick = (e) => {
    if (e.target.id != "deleteBtn") {
      document.getElementById(`modal_feedbackPost_${post._id}`).showModal();
      fetchComments(); // <-- traemos comentarios al abrir
    }
  };

  const handleClose = () => {
    document.getElementById(`modal_feedbackPost_${post._id}`).close();
    setActiveTab(1);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const session = { token: localStorage.getItem("token") };
      const res = await addFeedbackCommentRequest(
        post._id,
        commentText,
        session.token
      );
      console.log(res.data.post.comment);
      const newComment = {
        user: { _id: user._id, name: user.name },
        text: commentText,
        createdAt: new Date(),
      };
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  return (
    <>
      <div
        className="card bg-dark-400 shadow-md max-h-[350px]"
        onClick={(e) => handleClick(e)}
      >
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">{post.title}</h2>
            <div className="badge badge-secondary capitalize">
              {post.status}
            </div>
          </div>

          <p className="text-sm line-clamp-4">{post.description}</p>
          <p className="text-xs text-gray-500">
            Urgencia: <span className="capitalize">{post.urgency}</span>
          </p>

          {post.media && post.media.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.media.map((file, i) =>
                file.type === "image" ? (
                  <img
                    key={i}
                    src={file.url}
                    alt={`media-${i}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ) : (
                  <video
                    key={i}
                    src={file.url}
                    controls
                    className="w-full rounded max-h-40"
                  />
                )
              )}
            </div>
          )}

          <div className="mt-4 text-end">
            <button
              onClick={() => handleDeletePost(post._id)}
              className="btn btn-sm btn-error"
              id="deleteBtn"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <dialog
        id={`modal_feedbackPost_${post._id}`}
        className={`fixed w-screen h-screen max-w-none max-h-none z-[999] m-0 overflow-hidden bg-[#0006] grid justify-items-center place-items-center opacity-0 modal-task invisible transition-opacity`}
      >
        <div
          className={`transition-opacity delay-300 bg-dark-500 rounded-md max-w-[calc(100vw-10%)] w-[calc(100vw-10%)] md:w-[calc(100vw-20%)] lg:w-fit h-fit lg:px-6 lg:py-4 grid gap-3 overflow-hidden
            `}
        >
          {width >= 1024 ? (
            <div className="flex justify-between items-center w-full">
              <h1 className="w-fit font-medium text-lg">Feedback</h1>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-300"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="border-b border-gray-700 w-full max-w-[calc(100vw-10%)]">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <button
                    className={`flex items-center px-4 py-3 border-b-2 transition-colors w-fit focus:outline-none ${
                      activeTab === 1
                        ? "border-[#7E73FF] text-[#7E73FF]"
                        : "border-transparent text-gray-400 hover:text-gray-300 "
                    }`}
                    onClick={() => setActiveTab(1)}
                  >
                    <FileText className="w-5 h-5" />

                    <span
                      className={`${
                        width < 720 && activeTab !== 1 ? "hidden" : ""
                      } ${activeTab == 1 && "text-white"} pl-1 `}
                    >
                      Feedback
                    </span>
                  </button>
                  <button
                    className={`flex items-center px-4 py-3 border-b-2 transition-colors w-fit focus:outline-none ${
                      activeTab === 2
                        ? "border-[#7E73FF] text-[#7E73FF]"
                        : "border-transparent text-gray-400 hover:text-gray-300 "
                    }`}
                    onClick={() => setActiveTab(2)}
                  >
                    <MessageCircle className="w-5 h-5" />

                    <span
                      className={`${
                        width < 720 && activeTab !== 2 ? "hidden" : ""
                      } ${activeTab == 2 && "text-white"} pl-1 `}
                    >
                      Comentarios
                    </span>
                  </button>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-300"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div
            className={`grid grid-cols-[100%,100%] justify-items-center transition-transform duration-500  lg:grid-cols-[500px,48px,280px] ${
              activeTab == 2 && "translate-x-[-100%]"
            } max-lg:max-w-[calc(100vw-10%)]`}
          >
            <div
              className={`grid gap-2 ${
                activeTab == 2 && width < 1024 && "mr-6"
              } max-lg:px-4 max-lg:pb-2 w-full`}
            >
              <div>
                <h2 className="font-medium">Subject</h2>
                <p className="text-sm text-dark-100">{post.title}</p>
              </div>
              <div>
                <h2 className="font-medium">Description</h2>
                <p className="text-xs text-dark-100 w-full">
                  {post.description}
                </p>
              </div>
              <div className="flex gap-2">
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Urgency</span>
                  <div className="text-xs  badge badge-primary capitalize">
                    {post.urgency}
                  </div>
                </div>
                <div className="grid gap-1">
                  <span className="text-sm font-medium">Status</span>
                  <div className="text-xs badge badge-secondary capitalize">
                    {post.status}
                  </div>
                </div>
              </div>
              {post.media && post.media.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.media.map((file, i) =>
                    file.type === "image" ? (
                      <img
                        key={i}
                        src={file.url}
                        alt={`media-${i}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <video
                        key={i}
                        src={file.url}
                        controls
                        className="w-full rounded max-h-40"
                      />
                    )
                  )}
                </div>
              )}
            </div>
            <div className="hidden lg:flex divider divider-horizontal"></div>
            <div
              className={`grid grid-rows-[20px,240px,48px] gap-2  ${
                activeTab == 1 && width < 1024 && "ml-6"
              } max-lg:px-4 max-lg:pb-2`}
            >
              <h3 className="text-sm font-medium h-fit">Comments</h3>

              <div className="max-h-60 overflow-y-auto grid gap-2 pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-400">No comments yet.</p>
                ) : (
                  comments.map((comment, i) => (
                    <div
                      key={i}
                      className="text-xs bg-dark-400 p-2 rounded h-fit"
                    >
                      <div className="text-violet-main font-medium capitalize">
                        {comment.user.name}
                      </div>
                      <div>{comment.text}</div>
                      <div className="text-[10px] text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 items-start">
                <textarea
                  className="textarea textarea-bordered w-full h-[48px] text-xs resize-none"
                  rows={2}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={handleAddComment}
                  className="btn btn-sm btn-primary"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
