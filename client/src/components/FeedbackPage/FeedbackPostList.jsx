import { toast } from "sonner";
import CardFeedback from "./CardFeedback";
import { deleteFeedbackPostRequest } from "../../api/testerFeedback";

const FeedbackPostList = ({ posts, setPosts }) => {
  const handleDeletePost = async (id) => {
    try {
      const session = { token: localStorage.getItem("token") };
      await deleteFeedbackPostRequest(id, session.token);

      // Actualiza la lista de posts local (si usás useState)
      setPosts((prev) => prev.filter((p) => p._id !== id));

      toast.success("Post eliminado con éxito");
    } catch (err) {
      console.error(
        "Error al eliminar post:",
        err.response?.data || err.message
      );
      toast.error("No se pudo eliminar el post");
    }
  };

  return (
    <div className="grid gap-6">
  {posts.length === 0 ? (
    <p className="text-center text-lg text-gray-500">No hay feedbacks todavía.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <CardFeedback key={post._id} post={post} handleDeletePost={handleDeletePost}/>
      ))}
    </div>
  )}
</div>

  );
};

export default FeedbackPostList;
