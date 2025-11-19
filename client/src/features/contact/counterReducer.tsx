import { createSlice } from "@reduxjs/toolkit";

export type CounterState = {
  data: number;
};

const initialState: CounterState = {
  data: 42,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

/* export default function counterReducer(
  state = initialState,
  action: { type: string }
) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, data: state.data + 1 };
    case "DECREMENT":
      return { ...state, data: state.data - 1 };
    default:
      return state;
  }
} */
