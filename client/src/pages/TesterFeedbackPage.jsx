import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import FeedbackForm from "../components/FeedbackPage/FeedbackForm.jsx";
import FeedbackPostList from "../components/FeedbackPage/FeedbackPostList.jsx";
import { toast } from "sonner";
import { getMyFeedbackPostsRequest } from "../api/testerFeedback.js";

export default function TesterFeedbackPage({ setActiveItem }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveItem("tester-feedback");
  }, []);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const session = { token: localStorage.getItem("token") };
        const res = await getMyFeedbackPostsRequest(session.token);
        console.log("Mis feedbacks:", res.data);
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

    if (user?.role == "tester") {
      fetchMyPosts();
    }
  }, [user]);

  if (!user?.role == "tester") return <p>Access denied</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full h-dvh relative max-lg:pt-14 lg:pl-52">
      <div className="p-3">
        <h1 className="text-2xl font-bold mb-4">Tester Feedback</h1>
        <div className="grid gap-4">
          <FeedbackForm
            onPostCreated={(post) => setPosts((prev) => [post, ...prev])}
          />
          <FeedbackPostList posts={posts} setPosts={setPosts} />
        </div>
      </div>
    </div>
  );
}
