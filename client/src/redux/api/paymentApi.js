import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  endpoints: (builder) => ({
    makePayment: builder.mutation({
      query: ({
        orderItems,
        houseNumber,
        streetInfo,
        city,
        state,
        pinCode,
        tax = 0,
        shippingCharges = 0,
        subTotal,
        total,
      }) => ({
        url: "/create",
        method: "POST",
        body: {
          orderItems,
          houseNumber,
          streetInfo,
          city,
          state,
          pinCode,
          tax,
          shippingCharges,
          subTotal,
          total,
          successRedirectUrl: "/cart",
          failRedirectUrl: "/",
        },
        credentials: "include",
      }),
    }),
  }),
});

export const { useMakePaymentMutation } = paymentApi;
