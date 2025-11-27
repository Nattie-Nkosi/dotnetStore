import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", md: "3.75rem" },
            fontWeight: { xs: 600, md: 400 },
          }}
        >
          Welcome to DotnetStore
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 600,
            fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
            px: { xs: 1, sm: 0 },
          }}
        >
          Discover amazing products at great prices
        </Typography>
        <Button
          component={Link}
          to="/catalog"
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          Browse Products
        </Button>
      </Box>
    </Container>
  );
}
