import { baseApi } from "@/store/baseApi";

export const businessApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["business"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      registerBusiness: builder.mutation<void, any>({
        query: (data) => ({
          url: "business",
          method: "POST",
          body: data,
          formData: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        invalidatesTags: ["business"],
      }),
      getBusiness: builder.query<
        Array<{
          location: {
            latitude: number;
            longitude: number;
          };
          _id: string;
          name: string;
          description: string;
          phone: number;
          email: string;
          owner: string;
          isVerified: boolean;
          address: string;
          image: string;
          createdAt: string;
          updatedAt: string;
        }>,
        { owner: string }
      >({
        query: ({ owner }) => ({
          url: `business?owner=${owner}`,
          method: "GET",
        }),
        providesTags: ["business"],
      }),
      getBusinessById: builder.query<
        {
          location: {
            latitude: string;
            longitude: string;
          };
          _id: string;
          name: string;
          description: string;
          phone: number;
          email: string;
          owner: string;
          isVerified: boolean;
          address: string;
          image: string;
          createdAt: string;
          updatedAt: string;
        },
        { id: string }
      >({
        query: ({ id }) => ({
          url: `business/${id}`,
          method: "GET",
        }),
        providesTags: (_, __, { id }) => [{ type: "business", id }],
      }),
      editBusiness: builder.mutation<void, { id: string; data: any }>({
        query: ({ id, data }) => ({
          url: `business/${id}`,
          method: "PATCH",
          body: data,
          formData: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: "business", id },
          "business",
        ],
      }),
      deleteBusiness: builder.mutation<void, { id: string }>({
        query: ({ id }) => ({
          url: `business/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: "business", id },
          "business",
        ],
      }),
      listUnverifiedBusiness: builder.query<
        Array<{
          location: {
            latitude: number;
            longitude: number;
          };
          _id: string;
          name: string;
          description: string;
          phone: number;
          email: string;
          owner: string;
          isVerified: boolean;
          address: string;
          image: string;
          createdAt: string;
          updatedAt: string;
        }>,
        void
      >({
        query: () => ({
          url: `business/list/unverified`,
          method: "GET",
        }),
        providesTags: ["business"],
      }),
      verifyBusiness: builder.mutation<void, { id: string; verify: boolean }>({
        query: ({ id, ...rest }) => ({
          url: `business/${id}/verify`,
          method: "POST",
          body: rest,
        }),
        invalidatesTags: ["business"],
      }),
    }),
  });

export const {
  useRegisterBusinessMutation,
  useGetBusinessQuery,
  useGetBusinessByIdQuery,
  useEditBusinessMutation,
  useDeleteBusinessMutation,
  useListUnverifiedBusinessQuery,
  useVerifyBusinessMutation,
} = businessApi;
