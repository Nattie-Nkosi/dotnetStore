import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import { AccountCircle, Email, Person } from "@mui/icons-material";
import { useGetUserInfoQuery } from "./accountApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserInfoQuery();

  useEffect(() => {
    if (error) {
      navigate("/login", { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  const firstLetter = user.email.charAt(0).toUpperCase();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: 40,
                fontWeight: 600,
                mb: 2,
              }}
            >
              {firstLetter}
            </Avatar>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              My Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your account information
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Email color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user.email}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Person color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {user.userName}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <AccountCircle color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Roles
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  {user.roles.map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      size="small"
                      color={role === "Admin" ? "primary" : "default"}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Alert severity="info" sx={{ mb: 2 }}>
            Profile editing coming soon! For now, you can view your account
            information.
          </Alert>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            disabled
            sx={{ mb: 2 }}
          >
            Edit Profile (Coming Soon)
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Need to update your shipping address?{" "}
              <Typography
                component="span"
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/address")}
              >
                Go to Address
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
