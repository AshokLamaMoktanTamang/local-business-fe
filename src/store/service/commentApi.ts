import { baseApi } from "@/store/baseApi";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postComment: builder.mutation<void, { comment: string; business: string }>({
      query: ({ business, ...data }) => ({
        url: `comment/business/${business}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostCommentMutation } = commentApi;
