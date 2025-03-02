import { useForm } from "react-hook-form";
import { RichTextEditor } from "./editor";
import { Button } from "./ui/button";
import { usePostCommentMutation } from "@/store/service/commentApi";
import { FC } from "react";

const AddCommentForm: FC<{ businessId: string }> = ({ businessId }) => {
  const { control, register, watch, handleSubmit, reset } = useForm();
  const content = watch("content");

  const [addComment, { isLoading }] = usePostCommentMutation();
  const handleAddComment = (data: any) => {
    addComment({ business: businessId, ...data })
      .unwrap()
      .then(() => {
        reset();
      });
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddComment)}
      className="space-y-4 p-4 border rounded-lg"
    >
      <RichTextEditor {...register("content")} control={control} />
      <Button type="submit" disabled={!content?.trim?.() || isLoading}>
        Post Comment
      </Button>
    </form>
  );
};

export default AddCommentForm;
