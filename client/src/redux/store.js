import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { itemsApi } from "./api/itemsApi";
import { userReducer } from "./reducers/userReducer";
import { ordersApi } from "./api/ordersApi";
import { blogsApi } from "./api/blogsApi";
import { dashboardApi } from "./api/dashboardApi";
import { loaderReducer } from "./reducers/loaderReducer";
import { messageApi } from "./api/messageApi";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [loaderReducer.name]: loaderReducer.reducer,
  },
  middleware: (defaultMiddlewares) => [
    ...defaultMiddlewares(),
    userApi.middleware,
    itemsApi.middleware,
    ordersApi.middleware,
    blogsApi.middleware,
    dashboardApi.middleware,
    messageApi.middleware,
  ],
});
