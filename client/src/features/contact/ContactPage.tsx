import { decrement, increment } from "./counterReducer";
import { Button, ButtonGroup, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store";

export default function ContactPage() {
  const { data } = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
      >
        Contact Page
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 3,
          fontSize: { xs: "0.9375rem", sm: "1rem" },
        }}
      >
        The current counter value from the Redux store is: {data}
      </Typography>
      <ButtonGroup
        orientation={{ xs: "vertical", sm: "horizontal" }}
        sx={{ width: { xs: "100%", sm: "auto" } }}
      >
        <Button
          variant="contained"
          onClick={() => dispatch(increment(1))}
          sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
        >
          Increment
        </Button>
        <Button
          variant="contained"
          onClick={() => dispatch(decrement(1))}
          sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
        >
          Decrement
        </Button>
        <Button
          variant="contained"
          onClick={() => dispatch(increment(5))}
          sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
        >
          Increment by 5
        </Button>
      </ButtonGroup>
    </Box>
  );
}
