import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/msgSlice";
import orderReducer from "./slices/orderSlice";
import tokenReducer from "./slices/tokenSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    msg: errorReducer,
    user: userReducer,
    token: tokenReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
