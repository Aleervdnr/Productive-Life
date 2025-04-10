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
    <div className="grid gap-4">
      {posts.length === 0 ? (
        <p>No hay feedbacks todavía.</p>
      ) : (
        <div className="grid grid-cols-3 mx-6 gap-4">
          {posts.map((post) => (
            <CardFeedback key={post._id}>
              <CardFeedbackContent className="p-4 space-y-2 text-black">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{post.title}</h2>
                  <BadgeFeedback variant="secondary">
                    {post.status}
                  </BadgeFeedback>
                </div>
                <p className="text-sm">{post.description}</p>
                <p className="text-xs text-muted-foreground">
                  Urgencia: {post.urgency}
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
                          className="w-48 rounded"
                        />
                      )
                    )}
                  </div>
                )}
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </CardFeedbackContent>
            </CardFeedback>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPostList;
