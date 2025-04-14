import { toast } from "sonner";
import CardFeedback from "./CardFeedback";
import CardFeedbackContent from "./CardFeedbackContent";
import BadgeFeedback from "./BadgeFeedback";
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
        <div key={post._id} className="card bg-dark-400 shadow-md">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">{post.title}</h2>
              <div className="badge badge-secondary capitalize">
                {post.status}
              </div>
            </div>

            <p className="text-sm">{post.description}</p>
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
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default FeedbackPostList;
