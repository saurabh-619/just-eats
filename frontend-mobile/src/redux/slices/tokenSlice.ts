import { createSlice } from "@reduxjs/toolkit";

export interface ITokenStateProps {
  value: string | null;
}

const initialState = {
  value: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    resetToken: (state) => {
      state.value = null;
    },
    setToken: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { resetToken, setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
