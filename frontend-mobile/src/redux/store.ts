import { configureStore } from "@reduxjs/toolkit";
import errorReducer from "./slices/msgSlice";
import userReducer from "./slices/userSlice";
import tokenReducer from "./slices/tokenSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    msg: errorReducer,
    user: userReducer,
    token: tokenReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
