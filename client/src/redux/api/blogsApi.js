import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createUrlWithQuery } from "../../components/utils/utilityFunctions";
import serverPath from "../../components/utils/serverPath";

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/blogs/`,
  }),
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (body) => ({
        url: "new",
        body: body,
        method: "POST",
        credentials: "include",
      }),
    }),
    getAllBlogs: builder.query({
      query: ({ blogId, blogTitle, blogTag, page, limit }) => ({
        url: createUrlWithQuery("all", {
          id: blogId,
          title: blogTitle,
          tag: blogTag,
          limit: limit,
          page: page,
        }),
      }),
    }),
    getRecentBlogs: builder.query({
      query: () => ({
        url: "recent",
      }),
    }),
    getBlogById: builder.query({
      query: (blogId) => ({
        url: blogId,
      }),
    }),
    getBlogTags: builder.query({
      query: () => ({
        url: "tags/all",
        credentials: "include",
      }),
    }),
    removeBlog: builder.mutation({
      query: (blogId) => ({
        url: `${blogId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    editBlog: builder.mutation({
      query: ({ blogId, body }) => {
        const token = document.cookie.split("=")[1];
        return {
          url: `${blogId}`,
          method: "PATCH",
          body: body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useLazyGetBlogByIdQuery,
  useGetRecentBlogsQuery,
  useGetBlogTagsQuery,
  useCreateBlogMutation,
  useRemoveBlogMutation,
  useLazyGetAllBlogsQuery,
  useEditBlogMutation,
} = blogsApi;
