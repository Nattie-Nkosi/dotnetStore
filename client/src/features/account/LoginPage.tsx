/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "./accountApi";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../../lib/schemas/loginSchema";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/catalog";

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 2,
                borderRadius: "50%",
                mb: 2,
              }}
            >
              <LockOutlined sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Please sign in to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {location.state?.from && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please sign in to continue to checkout.
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Invalid email or password. Please try again.
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              {...register("email")}
              error={touchedFields.email && !!errors.email}
              helperText={touchedFields.email && errors.email?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              error={touchedFields.password && !!errors.password}
              helperText={touchedFields.password && errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mb: 2 }}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <MuiLink component={Link} to="/register" underline="hover">
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
