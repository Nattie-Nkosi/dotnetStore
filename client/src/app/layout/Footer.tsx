import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  Divider,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CodeIcon from "@mui/icons-material/Code";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 8,
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: "center", sm: "flex-start" }}
          sx={{ mb: 3 }}
        >
          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              DotnetStore
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Full-stack e-commerce portfolio project
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Built with .NET 9 & React 19
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Technologies
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Backend: .NET 9, EF Core, SQLite
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Frontend: React 19, TypeScript, Redux
              </Typography>
              <Typography variant="body2" color="text.secondary">
                UI: Material-UI v6
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Features
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                User Authentication & Authorization
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Shopping Cart & Checkout
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Stripe Payment Integration
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ textAlign: { xs: "center", sm: "right" } }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Connect
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", sm: "flex-end" }}
            >
              <Link
                href="https://github.com/Nattie-Nkosi"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <GitHubIcon />
              </Link>
              <Link
                href="https://www.linkedin.com/in/nkosinathi-nkosi/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <LinkedInIcon />
              </Link>
              <Link
                href="https://portfolio-site.com"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <CodeIcon />
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} DotnetStore. Portfolio Project for Software
            Development Interviews.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            This is a demonstration project showcasing full-stack development
            skills.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
