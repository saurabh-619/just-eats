import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../../apollo/__generated__/globalTypes";

export interface UserState {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
  verified?: boolean;
}

const initialState: UserState = {
  id: -1,
  email: "",
  role: UserRole.Client,
  verified: false,
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
      state.verified = false;
      state.createdAt = "";
    },
    setUser: (state, { payload }: PayloadAction<UserState>) => {
      console.log({ payload });
      state.id = payload.id;
      state.email = payload.email;
      state.role = payload.role;
      state.verified = payload.verified;
      state.createdAt = payload.createdAt;
    },
  },
});

export const { clearUser, setUser } = userSlice.actions;

export default userSlice.reducer;
