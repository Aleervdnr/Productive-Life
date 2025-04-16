import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getAllFeedbackPostsRequest } from "../api/testerFeedback.js";
import FeedbackPostList from "../components/FeedbackPage/FeedbackPostList.jsx";
import { useTranslation } from "../hooks/UseTranslation.jsx";

export default function AdminPage({setActiveItem}) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setActiveItem("admin-page");
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const session = { token: localStorage.getItem("token") };
        const res = await getAllFeedbackPostsRequest(session.token);
        console.log("Feedbacks:", res.data);
        setPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error al obtener feedback:",
          err.response?.data || err.message
        );
        //toast.error("feedback.load_error");
      }
    };

    if (user?.role == "admin") {
      fetchMyPosts();
    }
  }, [user]);
  if (!user?.role == "admin") return <p>Access denied</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div className="w-full h-dvh relative max-lg:pt-14 lg:pl-52">
      <div className="p-3">
        <h1 className="text-2xl font-bold mb-4">{t("testers.title")}</h1>
        <div className="grid gap-4">
          <FeedbackPostList posts={posts} setPosts={setPosts} />
        </div>
      </div>
    </div>
  );
}
