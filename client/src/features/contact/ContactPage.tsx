import { useSelector } from "react-redux";
import { CounterState } from "./counterReducer";
import { Typography } from "@mui/material";

export default function ContactPage() {
  const data = useSelector((state: CounterState) => state.data);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Contact Page Contact Page
      </Typography>
      <Typography variant="body1">
        The current counter value from the Redux store is: {data}
      </Typography>
    </>
  );
}
