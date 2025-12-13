import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/messages`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: ({ name, email, message }) => ({
        url: "/new",
        method: "POST",
        body: { name, email, message },
      }),
    }),
  }),
});

export const { useSendMessageMutation } = messageApi;
