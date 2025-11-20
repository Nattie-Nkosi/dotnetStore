import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate, useRouteError } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function ServerError() {
  const navigate = useNavigate();
  const error = useRouteError() as any;

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
        <ErrorOutlineIcon
          sx={{ fontSize: 120, color: "error.main", mb: 2 }}
        />
        <Typography variant="h1" sx={{ fontSize: 72, fontWeight: 700, mb: 1 }}>
          500
        </Typography>
        <Typography variant="h4" gutterBottom>
          Server Error
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
          We're sorry, something went wrong on our end. Our team has been notified
          and is working to fix the issue.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please try again later or contact support if the problem persists.
        </Typography>

        {error?.message && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary" gutterBottom>
              <strong>Technical Details:</strong>
            </Typography>
            <Typography
              variant="caption"
              component="pre"
              sx={{
                mt: 1,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                textAlign: "left",
              }}
            >
              {error.message}
            </Typography>
            {error?.stack && (
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  mt: 1,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  textAlign: "left",
                  fontSize: "0.65rem",
                }}
              >
                {error.stack}
              </Typography>
            )}
          </Box>
        )}

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
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
