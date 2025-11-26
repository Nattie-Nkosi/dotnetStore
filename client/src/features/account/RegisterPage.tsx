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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./accountApi";
import {
  PersonAddOutlined,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormData,
} from "../../lib/schemas/registerSchema";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        email: data.email,
        password: data.password,
      }).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "One number",
      met: /[0-9]/.test(password),
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          py: 4,
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
              <PersonAddOutlined sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to get started with your account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Registration failed. Please check your details and try again.
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              autoComplete="email"
              {...registerField("email")}
              error={touchedFields.email && !!errors.email}
              helperText={touchedFields.email && errors.email?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...registerField("password")}
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
              sx={{ mb: 2 }}
            />

            {password && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Password requirements:
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {passwordRequirements.map((req, index) => (
                    <ListItem key={index} sx={{ py: 0, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {req.met ? (
                          <CheckCircle
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                        ) : (
                          <Cancel sx={{ fontSize: 16, color: "text.disabled" }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={req.label}
                        primaryTypographyProps={{
                          variant: "caption",
                          color: req.met ? "success.main" : "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              {...registerField("confirmPassword")}
              error={touchedFields.confirmPassword && !!errors.confirmPassword}
              helperText={
                touchedFields.confirmPassword && errors.confirmPassword?.message
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <MuiLink component={Link} to="/login" underline="hover">
                  Sign in
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
