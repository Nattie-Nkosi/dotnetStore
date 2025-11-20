import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          p: 4,
          textAlign: "center",
        }}
      >
        <SearchOffIcon
          sx={{ fontSize: 120, color: "text.secondary", mb: 2 }}
        />
        <Typography variant="h1" sx={{ fontSize: 72, fontWeight: 700, mb: 1 }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500 }}>
          The page you're looking for doesn't exist. It might have been moved or deleted,
          or you may have mistyped the URL.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
