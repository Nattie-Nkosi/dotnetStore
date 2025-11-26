import { Navigate } from "react-router-dom";
import { useGetUserInfoQuery } from "../../features/account/accountApi";
import { Box, CircularProgress, Container } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { data: user, isLoading } = useGetUserInfoQuery();

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

  if (user) {
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
}
