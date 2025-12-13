import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createUrlWithQuery } from "../../components/utils/utilityFunctions";
import serverPath from "../../components/utils/serverPath";

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/items`,
  }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: ({
        itemId,
        search,
        category,
        maxPrice,
        minPrice,
        maxDiscount,
        minDiscount,
        rating,
        page,
        limit,
        latestItems,
        discountedItems,
      }) => ({
        url: createUrlWithQuery("all", {
          page: page,
          limit: limit,
          id: itemId,
          search: search,
          category: category,
          maxPrice: maxPrice,
          minPrice: minPrice,
          latestItems,
          discountedItems,
        }),
        // url: `/all?${page && `page=${page}&`}${limit && `limit=${limit}&`}${
        //   itemId && `id=${itemId}&`
        // }${search && `&search=${search}&`}${
        //   category && `category=${category}&`
        // }${maxPrice && `maxPrice=${maxPrice}&`}${
        //   minPrice && `minPrice=${minPrice}&`
        // }`,
      }),
    }),
    getItemById: builder.query({
      query: (itemId) => ({
        url: `${itemId}`,
        method: "GET",
      }),
    }),
    getLatestItems: builder.query({
      query: ({ page, limit }) => ({
        url: createUrlWithQuery("featured/latest", {
          page: page,
          limit: limit,
        }),
      }),
    }),
    getDiscountedItems: builder.query({
      query: ({ page, limit }) => ({
        url: createUrlWithQuery("featured/discounted", {
          page: page,
          limit: limit,
        }),
      }),
    }),
    getRatedItems: builder.query({
      query: ({ page, limit }) => ({
        url: createUrlWithQuery("featured/rated", {
          page: page,
          limit: limit,
        }),
      }),
    }),
    getItemCategories: builder.query({
      query: () => ({ url: "categories/all" }),
    }),
    createItem: builder.mutation({
      query: (body) => ({
        url: "new",
        method: "POST",
        body: body,
        credentials: "include",
      }),
    }),
    editItem: builder.mutation({
      query: ({ itemId, body }) => {
        console.log(body);
        console.log(itemId);
        let token = document.cookie.split("=")[1];
        return {
          url: `/${itemId}`,
          method: "PATCH",
          body: body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    removeItem: builder.mutation({
      query: (itemId) => ({
        url: `${itemId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetItemByIdQuery,
  useGetItemsQuery,
  useGetLatestItemsQuery,
  useGetDiscountedItemsQuery,
  useGetRatedItemsQuery,
  useGetItemCategoriesQuery,
  useCreateItemMutation,
  useEditItemMutation,
  useRemoveItemMutation,
  useLazyGetItemsQuery,
  useLazyGetItemCategoriesQuery,
  useLazyGetItemByIdQuery,
} = itemsApi;
