import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import serverPath from "../../components/utils/serverPath";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}/api/v1/admin/dashboard/`,
  }),
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => ({
        url: "stats",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetStatsQuery } = dashboardApi;
