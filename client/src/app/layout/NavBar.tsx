import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

interface Props {
  darkMode: boolean;
  onThemeChange: () => void;
}

export default function NavBar({ darkMode, onThemeChange }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Function to determine if a nav link is active
  const getActiveStyle = (isActive: boolean) => ({
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    fontWeight: isActive ? 600 : 500,
    textDecoration: "none",
    position: "relative",
    "&::after": isActive
      ? {
          content: '""',
          position: "absolute",
          bottom: -2,
          left: 0,
          width: "100%",
          height: 3,
          borderRadius: "4px 4px 0 0",
          backgroundColor: theme.palette.primary.main,
        }
      : {},
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  });

  // Mobile drawer toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: alpha(
          theme.palette.background.paper,
          darkMode ? 0.8 : 0.95
        ),
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        boxShadow: `0 1px 10px ${alpha(
          theme.palette.common.black,
          darkMode ? 0.15 : 0.05
        )}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 }, py: 1, justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                color: theme.palette.primary.main,
              },
              transition: "color 0.2s",
            }}
          >
            Dotnet-Store
          </Typography>

          {/* Mobile menu icon */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 3,
                  mx: "auto",
                  pl: 4,
                }}
              >
                {midLinks.map(({ title, path }) => (
                  <Typography
                    component={NavLink}
                    to={path}
                    key={path}
                    sx={({ isActive }) => getActiveStyle(isActive)}
                  >
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {rightLinks.map(({ title, path }) => (
                  <Button
                    component={NavLink}
                    to={path}
                    key={path}
                    variant={title === "register" ? "contained" : "text"}
                    size="small"
                    sx={({ isActive }) => ({
                      ...(title !== "register" && getActiveStyle(isActive)),
                      textTransform: "none",
                      minWidth: title === "register" ? "auto" : "unset",
                    })}
                  >
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                  </Button>
                ))}

                <IconButton
                  onClick={onThemeChange}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: darkMode
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                    "&:hover": {
                      bgcolor: darkMode
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.common.black, 0.05),
                    },
                  }}
                >
                  {darkMode ? (
                    <Brightness7Icon fontSize="small" />
                  ) : (
                    <Brightness4Icon fontSize="small" />
                  )}
                </IconButton>

                <IconButton
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.secondary.main, 0.2),
                    },
                  }}
                >
                  <Badge badgeContent={4} color="secondary">
                    <ShoppingCartIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen && isMobile}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: "70%",
            maxWidth: 300,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, pt: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Menu
          </Typography>
          <List>
            {midLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                onClick={toggleMobileMenu}
                sx={({ isActive }) => ({
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                })}
              >
                <ListItemText
                  primary={title.charAt(0).toUpperCase() + title.slice(1)}
                  primaryTypographyProps={{
                    sx: ({ isActive }: any) => ({
                      fontWeight: isActive ? 600 : 500,
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }),
                  }}
                />
              </ListItem>
            ))}
            <Box
              sx={{
                height: 1,
                width: "100%",
                my: 2,
                bgcolor: alpha(theme.palette.divider, 0.1),
              }}
            />
            {rightLinks.map(({ title, path }) => (
              <ListItem
                component={NavLink}
                to={path}
                key={path}
                onClick={toggleMobileMenu}
                sx={({ isActive }) => ({
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                })}
              >
                <ListItemText
                  primary={title.charAt(0).toUpperCase() + title.slice(1)}
                  primaryTypographyProps={{
                    sx: ({ isActive }: any) => ({
                      fontWeight: isActive ? 600 : 500,
                      color: isActive
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    }),
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box
            sx={{
              display: "flex",
              mt: 4,
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <IconButton onClick={onThemeChange}>
              {darkMode ? (
                <Brightness7Icon fontSize="small" />
              ) : (
                <Brightness4Icon fontSize="small" />
              )}
            </IconButton>
            <IconButton>
              <Badge badgeContent={4} color="secondary">
                <ShoppingCartIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
