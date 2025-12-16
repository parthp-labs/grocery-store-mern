import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createUrlWithQuery } from "../../components/utils/utilityFunctions";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/orders/`,
  }),

  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: ({
        houseNumber,
        streetInfo,
        city,
        state,
        pinCode,
        orderItems,
        subTotal,
        totalAmount,
        shippingCharges = 0,
        tax = 0,
        paymentMode,
      }) => ({
        url: "/new",
        method: "POST",
        body: {
          houseNumber,
          streetInfo,
          city,
          state,
          pinCode,
          orderItems,
          subTotal,
          totalAmount,
          deliveryCharges: 0,
          tax: 0,
          paymentMode,
          successRedirectUrl: `${import.meta.env.VITE_NETWORK}:${import.meta.env.VITE_PORT}/order/success`,
          failRedirectUrl: `${import.meta.env.VITE_NETWORK}:${import.meta.env.VITE_PORT}/order/fail`,
        },
        credentials: "include",
      }),
    }),
    getOrder: builder.query({
      query: (orderId) => ({
        url: `${orderId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getUserOrders: builder.query({
      query: ({
        orderId = "",
        maxAmount = "",
        minAmount = "",
        fromDate = "",
        toDate = "",
        status = "",
      }) => ({
        url: createUrlWithQuery("user/all", {
          orderId,
          maxAmount,
          minAmount,
          status,
          toDate,
          fromDate,
        }),
        method: "GET",
        credentials: "include",
      }),
    }),
    cancelOrder: builder.mutation({
      query: (orderId) => {
        const token = document.cookie.split("=")[1];
        return {
          url: `${orderId}/cancel`,
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    getAllOrders: builder.query({
      query: ({ orderId, userId, status }) => ({
        url: `admin/all?id=${orderId || ""}&userId=${userId || ""}&status=${
          status || ""
        }`,
        credentials: "include",
      }),
    }),
    processOrder: builder.mutation({
      query: ({ orderId, status }) => {
        const token = document.cookie.split("=")[1];
        return {
          url: `/${orderId}`,
          method: "PATCH",
          body: { status },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    downloadOrderInvoice: builder.query({
      query: ({ orderId }) => {
        return {
          url: `/${orderId}/download`,
          method: "GET",
          credentials: "include",
        };
      },
      responseHandler: async (response) => {
        if (response.ok) {
          const blob = await response.blob();
          const disposition = response.headers.get("Content-Disposition");
          const filename = decodeURIComponent(
            disposition.match(/filename="(.+)"/)[1]
          ); // Extract filename from Content-Disposition header

          return { blob, filename };
        } else {
          const errorData = await response.json();
          return { message: errorData.message };
        }
      },
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrderQuery,
  useCancelOrderMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useLazyGetOrderQuery,
  useProcessOrderMutation,
  useLazyDownloadOrderInvoiceQuery,
} = ordersApi;
