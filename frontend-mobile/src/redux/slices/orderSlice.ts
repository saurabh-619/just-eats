import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IOption {
  name: string;
  extra?: number;
}
export interface IOrderItem {
  dishId: number;
  options: IOption[];
  price?: number;
}

export interface OrderState {
  value: IOrderItem[];
  total: number;
}

const initialState: OrderState = {
  value: [],
  total: 0,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderItem: (state, { payload }: PayloadAction<IOrderItem>) => {
      console.log({ payload });
      if (
        state.value.find((item) => item.dishId === payload.dishId) === undefined
      ) {
        state.value.push(payload);
        state.value = state.value;
        state.total += payload.price || 0;
      }
    },
    removeOrderItem: (
      state,
      {
        payload: { dishId, price },
      }: PayloadAction<{ dishId: number; price: number }>
    ) => {
      state.value = state.value.filter((item) => item.dishId !== dishId);
      state.total -= price || 0;
    },
    addOrderOption: (
      state,
      {
        payload: { dishId, optionName, extra },
      }: PayloadAction<{ dishId: number; optionName: string; extra: number }>
    ) => {
      state.value = state.value.map((item) => {
        if (
          item.dishId === dishId &&
          item.options.find((opt) => opt.name === optionName) === undefined
        ) {
          item.options.push({ name: optionName });
          state.total += extra;
        }
        return item;
      });
    },
    removeOrderOption: (
      state,
      {
        payload: { dishId, optionName, extra },
      }: PayloadAction<{ dishId: number; optionName: string; extra: number }>
    ) => {
      state.value = state.value.map((item) => {
        if (
          item.dishId === dishId &&
          item.options.find((opt) => opt.name === optionName) !== undefined
        ) {
          const newOptions = item.options.filter(
            (opt) => opt.name !== optionName
          );
          state.total -= extra;

          return {
            dishId,
            options: newOptions,
          };
        }
        return item;
      });
    },
    resetOrder: (state) => {
      console.log("reset order");
      state.value = [];
      state.total = 0;
    },
  },
});

export const {
  addOrderItem,
  removeOrderItem,
  resetOrder,
  addOrderOption,
  removeOrderOption,
} = orderSlice.actions;
export default orderSlice.reducer;
