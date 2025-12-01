import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CodeIcon from "@mui/icons-material/Code";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";

export default function HomePage() {
  const techStack = [
    ".NET 9",
    "React 19",
    "TypeScript",
    "Redux Toolkit",
    "Material-UI",
    "Entity Framework Core",
    "Stripe API",
    "SQLite",
  ];

  const features = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Full E-Commerce Flow",
      description:
        "Complete shopping experience with product catalog, cart management, and checkout process.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Secure Authentication",
      description:
        "User authentication with JWT tokens, role-based authorization, and protected routes.",
    },
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Modern Tech Stack",
      description:
        "Built with latest technologies including .NET 9, React 19, and TypeScript for type safety.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Payment Integration",
      description:
        "Integrated Stripe payment processing with PaymentIntent for secure transactions.",
    },
  ];

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40vh",
          textAlign: "center",
          px: { xs: 2, sm: 3 },
          mb: 6,
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
          DotnetStore
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 700,
            fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
            px: { xs: 1, sm: 0 },
            mb: 2,
          }}
        >
          A Full-Stack E-Commerce Application
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 800,
            fontSize: { xs: "0.95rem", sm: "1rem" },
            px: { xs: 1, sm: 0 },
            mb: 3,
          }}
        >
          Portfolio project demonstrating modern web development practices with
          .NET backend and React frontend, featuring secure authentication,
          payment processing, and responsive design.
        </Typography>
        <Button
          component={Link}
          to="/catalog"
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            px: { xs: 4, sm: 6 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          Browse Products
        </Button>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 4, fontWeight: 500 }}
        >
          Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500 }}
        >
          Technology Stack
        </Typography>
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ gap: 1.5 }}
        >
          {techStack.map((tech, index) => (
            <Chip
              key={index}
              label={tech}
              color="primary"
              variant="outlined"
              sx={{
                fontSize: "0.95rem",
                py: 2.5,
                px: 1,
                fontWeight: 500,
              }}
            />
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
