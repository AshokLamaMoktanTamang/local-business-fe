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
  }),
});

export const { useRegisterBusinessMutation } = businessApi;
