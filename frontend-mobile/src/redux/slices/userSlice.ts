import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../../apollo/__generated__/globalTypes";

export interface UserState {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
  isVerified?: boolean;
}

const initialState: UserState = {
  id: -1,
  email: "",
  role: UserRole.Client,
  isVerified: false,
  createdAt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.id = -1;
      state.email = "";
      state.role = UserRole.Client;
      state.isVerified = false;
      state.createdAt = "";
    },
    setUser: (state, { payload }: PayloadAction<UserState>) => {
      state.id = payload.id;
      state.email = payload.email;
      state.role = payload.role;
      state.isVerified = payload.isVerified;
      state.createdAt = payload.createdAt;
    },
  },
});

export const { clearUser, setUser } = userSlice.actions;

export default userSlice.reducer;
