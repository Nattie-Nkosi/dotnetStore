import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import { useAppDispatch, useAppSelector } from "../store/store";
import { toggleDarkMode } from "../store/uiSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const darkMode = useAppSelector((state) => state.ui.darkMode);
  const dispatch = useAppDispatch();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="bottom-right"
        theme={darkMode ? "dark" : "light"}
        aria-label={undefined}
      />
      <LoadingIndicator />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavBar
          darkMode={darkMode}
          onThemeChange={() => dispatch(toggleDarkMode())}
        />
        <Box
          component="main"
          sx={{
            flex: 1,
            background: theme.palette.background.default,
            pt: { xs: 2, sm: 4, md: 8 },
            pb: { xs: 4, sm: 5, md: 6 },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              mt: { xs: 7, sm: 8 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Outlet />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
