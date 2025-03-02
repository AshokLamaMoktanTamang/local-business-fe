import { baseApi } from "@/store/baseApi";

export const commentApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["coments"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postComment: builder.mutation<
        void,
        { comment: string; business: string }
      >({
        query: ({ business, ...data }) => ({
          url: `comment/business/${business}`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: (_, __, { business }) => [
          { type: "coments", id: business },
        ],
      }),
      listBusinessComments: builder.query<
        Array<{
          _id: string;
          userId: {
            username: string;
            email: string;
            id: string;
          };
          businessOwner: string;
          businessId: string;
          content: string;
          createdAt: string;
          updatedAt: string;
          __v: 0;
        }>,
        { business: string }
      >({
        query: ({ business, ...data }) => ({
          url: `comment/business/${business}`,
          method: "GET",
          body: data,
        }),
        providesTags: (_, __, { business }) => [
          { type: "coments", id: business },
        ],
      }),
    }),
  });

export const { usePostCommentMutation, useListBusinessCommentsQuery } =
  commentApi;
