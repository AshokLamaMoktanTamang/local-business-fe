import { baseApi } from "@/store/baseApi";

export const businessApi = baseApi.injectEndpoints({
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
    }),
  }),
});

export const { useRegisterBusinessMutation, useGetBusinessQuery } = businessApi;
