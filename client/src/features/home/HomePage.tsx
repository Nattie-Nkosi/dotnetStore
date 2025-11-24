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
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to DotnetStore
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
          Discover amazing products at great prices
        </Typography>
        <Button
          component={Link}
          to="/catalog"
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          Browse Products
        </Button>
      </Box>
    </Container>
  );
}
