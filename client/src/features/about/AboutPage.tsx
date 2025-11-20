import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  useLazyGetNotFoundQuery,
  useLazyGetBadRequestQuery,
  useLazyGetUnauthorizedQuery,
  useLazyGetValidationErrorQuery,
  useLazyGetServerErrorQuery,
  useLazyGetNullReferenceQuery,
  useLazyGetDivideByZeroQuery,
  useLazyGetArgumentNullQuery,
  useLazyGetArgumentExceptionQuery,
  useLazyGetInvalidOperationQuery,
} from "../../app/api/buggyApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useState } from "react";

interface ProblemDetails {
  title?: string;
  status?: number;
  detail?: string;
  type?: string;
  errors?: Record<string, string[]>;
}

interface QueryResult {
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
}

export default function AboutPage() {
  const [triggerNotFound, notFoundResult] = useLazyGetNotFoundQuery();
  const [triggerBadRequest, badRequestResult] = useLazyGetBadRequestQuery();
  const [triggerUnauthorized, unauthorizedResult] =
    useLazyGetUnauthorizedQuery();
  const [triggerValidationError, validationErrorResult] =
    useLazyGetValidationErrorQuery();
  const [triggerServerError, serverErrorResult] = useLazyGetServerErrorQuery();
  const [triggerNullReference, nullReferenceResult] =
    useLazyGetNullReferenceQuery();
  const [triggerDivideByZero, divideByZeroResult] =
    useLazyGetDivideByZeroQuery();
  const [triggerArgumentNull, argumentNullResult] =
    useLazyGetArgumentNullQuery();
  const [triggerArgumentException, argumentExceptionResult] =
    useLazyGetArgumentExceptionQuery();
  const [triggerInvalidOperation, invalidOperationResult] =
    useLazyGetInvalidOperationQuery();

  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    throw new Error("This is a test React error to demonstrate the error boundary");
  }

  const renderError = (result: QueryResult) => {
    if (result.isLoading) {
      return (
        <Alert severity="info">
          <AlertTitle>Loading...</AlertTitle>
        </Alert>
      );
    }

    if (result.error) {
      const isFetchError = (
        error: FetchBaseQueryError | SerializedError
      ): error is FetchBaseQueryError => {
        return "status" in error;
      };

      if (isFetchError(result.error)) {
        const errorData = result.error.data as ProblemDetails | undefined;

        if (errorData?.errors) {
          return (
            <Alert severity="error" sx={{ width: '100%' }}>
              <AlertTitle>Validation Failed</AlertTitle>
              <Typography variant="body2" gutterBottom>
                Please correct the following errors:
              </Typography>
              <List dense disablePadding>
                {Object.entries(errorData.errors).map(([field, messages]) => (
                  <ListItem key={field} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <ErrorOutlineIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" component="span">
                          <strong>{field}:</strong>{" "}
                          {Array.isArray(messages)
                            ? messages.join(", ")
                            : String(messages)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          );
        }

        if (result.error.status === 404) {
          return (
            <Alert severity="warning" sx={{ width: '100%' }}>
              <AlertTitle>Not Found</AlertTitle>
              <Typography variant="body2" gutterBottom>
                {errorData?.title || "The resource you're looking for could not be found."}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This could be because:
              </Typography>
              <List dense sx={{ pl: 2 }}>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <Typography variant="body2">The item has been removed or deleted</Typography>
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <Typography variant="body2">The URL or ID is incorrect</Typography>
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                  <Typography variant="body2">You don't have permission to access this resource</Typography>
                </ListItem>
              </List>
            </Alert>
          );
        }

        if (result.error.status === 500) {
          return (
            <Alert severity="error" sx={{ width: '100%' }}>
              <AlertTitle>Server Error</AlertTitle>
              <Typography variant="body2" gutterBottom>
                We're sorry, something went wrong on our end. Our team has been notified.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please try again later or contact support if the problem persists.
              </Typography>
              {errorData?.detail && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" component="div" color="text.secondary">
                    <strong>Technical Details:</strong>
                  </Typography>
                  <Typography variant="caption" component="pre" sx={{ mt: 0.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {errorData.detail}
                  </Typography>
                </Box>
              )}
            </Alert>
          );
        }

        return (
          <Alert severity="error">
            <AlertTitle>Error {result.error.status}</AlertTitle>
            <Typography variant="body2">
              <strong>Status:</strong> {result.error.status}
            </Typography>
            {errorData?.title && (
              <Typography variant="body2">
                <strong>Title:</strong> {errorData.title}
              </Typography>
            )}
            {errorData?.detail && (
              <Typography variant="body2">
                <strong>Detail:</strong> {errorData.detail}
              </Typography>
            )}
          </Alert>
        );
      }

      return (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <Typography variant="body2">
            {result.error.message || "An unknown error occurred"}
          </Typography>
        </Alert>
      );
    }

    return null;
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Error Handling Demo
        </Typography>
        <Typography variant="body1" paragraph>
          Click the buttons below to test different error scenarios. The API
          will return various HTTP status codes and error responses.
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Test Error Endpoints
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerNotFound()}
              >
                404 - Not Found
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                onClick={() => triggerBadRequest()}
              >
                400 - Bad Request
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="info"
                onClick={() => triggerUnauthorized()}
              >
                401 - Unauthorized
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => triggerValidationError()}
              >
                Validation Error
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerServerError()}
              >
                500 - Server Error
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerNullReference()}
              >
                Null Reference Error
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerDivideByZero()}
              >
                Divide By Zero Error
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerArgumentNull()}
              >
                Argument Null Error
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerArgumentException()}
              >
                Argument Exception
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => triggerInvalidOperation()}
              >
                Invalid Operation Error
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => setThrowError(true)}
              >
                React Error (Error Boundary)
              </Button>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            {renderError(notFoundResult)}
            {renderError(badRequestResult)}
            {renderError(unauthorizedResult)}
            {renderError(validationErrorResult)}
            {renderError(serverErrorResult)}
            {renderError(nullReferenceResult)}
            {renderError(divideByZeroResult)}
            {renderError(argumentNullResult)}
            {renderError(argumentExceptionResult)}
            {renderError(invalidOperationResult)}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
