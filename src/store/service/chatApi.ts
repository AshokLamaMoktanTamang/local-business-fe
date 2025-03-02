import { baseApi } from "@/store/baseApi";

export const chatApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["chats"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      listBusinesschats: builder.query<
        Array<{
          _id: string;
          senderId: string;
          recieverId: string;
          message: string;
          createdAt: string;
          updatedAt: string;
        }>,
        { receiverId: string; businessId: string }
      >({
        query: ({ receiverId, businessId, ...data }) => ({
          url: `chat/business/${businessId}/${receiverId}`,
          method: "GET",
          body: data,
        }),
        providesTags: (_, __, { receiverId, businessId }) => [
          { type: "chats", id: receiverId + businessId },
        ],
      }),
      getChatHeadOfBusiness: builder.query<
        Array<{
          _id: string;
          sender: {
            _id: string;
            username: string;
            email: string;
          };
          message: string;
        }>,
        { businessId: string }
      >({
        query: ({ businessId, ...data }) => ({
          url: `chat/business/${businessId}`,
          method: "GET",
          body: data,
        }),
      }),
    }),
  });

export const { useListBusinesschatsQuery, useGetChatHeadOfBusinessQuery } =
  chatApi;
