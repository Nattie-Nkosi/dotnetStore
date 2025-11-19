export type CounterState = {
  data: number;
};

const initialState: CounterState = {
  data: 42,
};

export default function counterReducer(state = initialState) {
  return state;
}
