import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Toast, { ToastPosition } from "react-native-toast-message";

export enum MsgType {
  SUCCESS = "success",
  ERROR = "error",
}

export interface IAppMsgState {
  id?: number;
  position?: ToastPosition;
  msg: string;
}

const initialState: IAppMsgState = {
  id: 0,
  msg: "",
  position: "bottom",
};

const appMsgSlice = createSlice({
  name: "app-error",
  initialState,
  reducers: {
    removeError: (state) => {
      state.id = 0;
      state.msg = "";
    },
    setError: (state, { payload }: PayloadAction<IAppMsgState>) => {
      state.id = Math.ceil(Math.random() * 100);
      state.msg = payload.msg;
      Toast.show({
        type: MsgType.ERROR,
        position: payload.position || "bottom",
        text1: "Error",
        text2: payload.msg,
        bottomOffset: 15,
      });
    },
    setSuccess: (state, { payload }: PayloadAction<IAppMsgState>) => {
      state.id = Math.ceil(Math.random() * 100);
      state.msg = payload.msg;
      Toast.show({
        type: MsgType.SUCCESS,
        position: payload.position || "bottom",
        text1: "Success",
        text2: payload.msg,
        bottomOffset: 15,
      });
    },
  },
});

export const { setError, setSuccess } = appMsgSlice.actions;
export default appMsgSlice.reducer;
