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
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <SearchOffIcon
          sx={{
            fontSize: { xs: 80, sm: 100, md: 120 },
            color: "text.secondary",
            mb: 2,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 48, sm: 60, md: 72 },
            fontWeight: 700,
            mb: 1,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 500,
            px: { xs: 2, sm: 0 },
            fontSize: { xs: "0.9375rem", sm: "1rem" },
          }}
        >
          The page you're looking for doesn't exist. It might have been moved or deleted,
          or you may have mistyped the URL.
        </Typography>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            fullWidth={{ xs: true, sm: false }}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            fullWidth={{ xs: true, sm: false }}
          >
            Go Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
