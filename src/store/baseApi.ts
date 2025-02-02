import axios from "axios";
import config from "@/config";
import { toast } from "react-toastify";
import { createApi } from "@reduxjs/toolkit/query/react";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: async ({ url, method = "GET", body }: any) => {
    try {
      const response = await axiosInstance({
        url,
        method,
        data: body,
      });
      return { data: response.data };
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return {
        error: {
          status: error.response?.status || "UNKNOWN_ERROR",
          message: error.response?.data?.message || error.message,
        },
      };
    }
  },
  endpoints: () => ({}),
});

export default baseApi;
