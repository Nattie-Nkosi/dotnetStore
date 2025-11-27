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
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: { xs: 80, sm: 100, md: 120 },
            color: "error.main",
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
          500
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
        >
          Server Error
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: 600,
            px: { xs: 2, sm: 0 },
            fontSize: { xs: "0.9375rem", sm: "1rem" },
          }}
        >
          We're sorry, something went wrong on our end. Our team has been notified
          and is working to fix the issue.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            px: { xs: 2, sm: 0 },
            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
          }}
        >
          Please try again later or contact support if the problem persists.
        </Typography>

        {error?.message && (
          <Box
            sx={{
              mt: 3,
              p: { xs: 1.5, sm: 2 },
              bgcolor: "action.hover",
              borderRadius: 1,
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            >
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
                fontSize: { xs: "0.7rem", sm: "0.75rem" },
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
                  fontSize: { xs: "0.6rem", sm: "0.65rem" },
                }}
              >
                {error.stack}
              </Typography>
            )}
          </Box>
        )}

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
            onClick={() => window.location.reload()}
            fullWidth={{ xs: true, sm: false }}
          >
            Reload Page
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
