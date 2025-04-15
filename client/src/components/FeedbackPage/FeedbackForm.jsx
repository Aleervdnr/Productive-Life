import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { createFeedbackPostRequest } from "../../api/testerFeedback";
import { useTranslation } from "../../hooks/UseTranslation";

const FeedbackForm = ({ onPostCreated }) => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("urgency", data.urgency);

      // Adjuntar archivos
      if (data.media && data.media.length > 0) {
        for (let i = 0; i < data.media.length; i++) {
          formData.append("media", data.media[i]);
        }
      }
      const session = { token: localStorage.getItem("token") };
      const res = await createFeedbackPostRequest(formData, session.token);

      onPostCreated(res.data.post);
      //toast.success("feedback.submitted"); // código que vas a traducir en el front
      setLoading(false);
      reset();
    } catch (err) {
      //toast.error("feedback.error"); // código que vas a traducir en el front
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 max-w-xl mx-auto bg-dark-400 shadow-md rounded-lg"
    >
      <input
        type="text"
        placeholder={t("testers.form.titlePlaceholder")}
        {...register("title", { required: true })}
        className="input input-bordered w-full bg-dark-400"
      />

      <textarea
        placeholder={t("testers.form.descriptionPlaceholder")}
        {...register("description", { required: true })}
        className="textarea textarea-bordered w-full bg-dark-400"
      />

      <select
        {...register("urgency")}
        className="select select-bordered w-full bg-dark-400"
      >
        <option value="low">{t("testers.form.urgency.low")}</option>
        <option value="medium">{t("testers.form.urgency.medium")}</option>
        <option value="high">{t("testers.form.urgency.high")}</option>
      </select>

      <input
        type="file"
        {...register("media")}
        multiple
        accept="image/*,video/*"
        className="file-input file-input-bordered w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="btn text-white w-full bg-violet-main"
      >
        {loading ? t("testers.form.sending") : t("testers.form.sendButton")}
      </button>
    </form>
  );
};

export default FeedbackForm;
