import { Navigate, useLocation } from "react-router-dom";
import { useGetUserInfoQuery } from "../../features/account/accountApi";
import { Box, CircularProgress, Container } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { data: user, isLoading } = useGetUserInfoQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
