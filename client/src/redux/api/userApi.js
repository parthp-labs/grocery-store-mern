import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({ url: "/", method: "get", credentials: "include" }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "new",
        method: "POST",
        body: body,
        credentials: "include",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),
    }),
    verify: builder.mutation({
      query: ({ verificationCode }) => ({
        url: "/verify",
        method: "POST",
        body: { verificationCode },
        credentials: "include",
      }),
    }),
    sendVerificationCode: builder.mutation({
      query: ({ email }) => ({
        url: "/send-code",
        method: "POST",
        body: { email },
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "post",
        credentials: "include",
      }),
    }),
    addToCart: builder.mutation({
      query: ({ itemId, quantity }) => {
        let token = document.cookie.split("=")[1];
        return {
          url: "/cart/add",
          method: "PATCH",
          body: { itemId, quantity },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    removeFromCart: builder.mutation({
      query: ({ itemId, quantity }) => {
        let token = document.cookie.split("=")[1];
        return {
          url: "/cart/remove",
          method: "PATCH",
          body: { itemId, quantity },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    getAllUsers: builder.query({
      query: ({ userId, email, gender, role }) => ({
        url: `all?userId=${userId || ""}&email=${email || ""}&gender=${
          gender || ""
        }&role=${role || ""}`,
        credentials: "include",
      }),
    }),
    deleteUserByAdmin: builder.mutation({
      query: ({ id }) => ({
        url: `${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    makeAdmin: builder.mutation({
      query: ({ id }) => {
        const token = document.cookie.split("=")[1];
        return {
          url: `${id}/makeAdmin`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLazyGetAllUsersQuery,
  useGetUserQuery,
  useSendVerificationCodeMutation,
  useLazyGetUserQuery,
  useLogoutMutation,
  useAddToCartMutation,
  useMakeAdminMutation,
  useRemoveFromCartMutation,
  useGetAllUsersQuery,
  useDeleteUserByAdminMutation,
  useVerifyMutation,
} = userApi;
