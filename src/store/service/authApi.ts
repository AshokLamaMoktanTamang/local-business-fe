import { baseApi } from "@/store/baseApi";

export enum USER_ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signUp: builder.mutation<
      void,
      { username: string; email: string; password: string }
    >({
      query: (data) => ({
        url: "auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query<
      {
        username: string;
        email: string;
        role: USER_ROLE;
        id: string;
      },
      void
    >({
      query: () => ({
        url: "user/profile",
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation, useGetProfileQuery } =
  authApi;
