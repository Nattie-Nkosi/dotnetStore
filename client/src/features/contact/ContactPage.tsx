import { decrement, increment } from "./counterReducer";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";

export default function ContactPage() {
  const { data } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Contact Page Contact Page
      </Typography>
      <Typography variant="body1">
        The current counter value from the Redux store is: {data}
      </Typography>
      <ButtonGroup>
        <Button variant="contained" onClick={() => dispatch(increment(1))}>
          Increment
        </Button>
        <Button variant="contained" onClick={() => dispatch(decrement(1))}>
          Decrement
        </Button>
        <Button variant="contained" onClick={() => dispatch(increment(5))}>
          Increment by 5
        </Button>
      </ButtonGroup>
    </>
  );
}
