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
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import { LogoutOutlined, PersonOutline, LocationOnOutlined, ReceiptLongOutlined, Inventory2Outlined } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFetchBasketQuery } from "../../features/basket/basketApi";
import { useGetUserInfoQuery, useLogoutMutation } from "../../features/account/accountApi";

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
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: basket } = useFetchBasketQuery();
  const { data: user } = useGetUserInfoQuery();
  const [logout] = useLogoutMutation();

  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      handleUserMenuClose();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
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
                    sx={(theme) => ({
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      textDecoration: "none",
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                      "&.active": {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: -2,
                          left: 0,
                          width: "100%",
                          height: 3,
                          borderRadius: "4px 4px 0 0",
                          backgroundColor: theme.palette.primary.main,
                        },
                      },
                    })}
                  >
                    {title.charAt(0).toUpperCase() + title.slice(1)}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {user ? (
                  <>
                    <Box
                      onClick={handleUserMenuOpen}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: theme.palette.primary.main,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(user.email)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {user.email.split("@")[0]}
                      </Typography>
                    </Box>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleUserMenuClose}
                      onClick={handleUserMenuClose}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                      slotProps={{
                        paper: {
                          sx: {
                            mt: 1.5,
                            minWidth: 200,
                            borderRadius: 2,
                            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                          },
                        },
                      }}
                    >
                      <MenuItem
                        onClick={handleUserMenuClose}
                        sx={{ py: 1.5, px: 2 }}
                      >
                        <ListItemIcon>
                          <PersonOutline fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Profile"
                          primaryTypographyProps={{ fontSize: "0.875rem" }}
                        />
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleUserMenuClose();
                          navigate("/orders");
                        }}
                        sx={{ py: 1.5, px: 2 }}
                      >
                        <ListItemIcon>
                          <ReceiptLongOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="My Orders"
                          primaryTypographyProps={{ fontSize: "0.875rem" }}
                        />
                      </MenuItem>
                      {user?.roles.includes("Admin") && (
                        <MenuItem
                          onClick={() => {
                            handleUserMenuClose();
                            navigate("/inventory");
                          }}
                          sx={{ py: 1.5, px: 2 }}
                        >
                          <ListItemIcon>
                            <Inventory2Outlined fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Inventory"
                            primaryTypographyProps={{ fontSize: "0.875rem" }}
                          />
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={handleUserMenuClose}
                        sx={{ py: 1.5, px: 2 }}
                      >
                        <ListItemIcon>
                          <LocationOnOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary="My Address"
                          primaryTypographyProps={{ fontSize: "0.875rem" }}
                        />
                      </MenuItem>
                      <Divider sx={{ my: 0.5 }} />
                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          py: 1.5,
                          px: 2,
                          color: theme.palette.error.main,
                        }}
                      >
                        <ListItemIcon>
                          <LogoutOutlined fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Logout"
                          primaryTypographyProps={{ fontSize: "0.875rem" }}
                        />
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    {rightLinks.map(({ title, path }) => (
                      <Button
                        component={NavLink}
                        to={path}
                        key={path}
                        variant={title === "register" ? "contained" : "text"}
                        size="small"
                        sx={(theme) => ({
                          textTransform: "none",
                          minWidth: title === "register" ? "auto" : "unset",
                          ...(title !== "register" && {
                            color: theme.palette.text.primary,
                            fontWeight: 500,
                            textDecoration: "none",
                            position: "relative",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              color: theme.palette.primary.main,
                            },
                            "&.active": {
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            },
                          }),
                        })}
                      >
                        {title.charAt(0).toUpperCase() + title.slice(1)}
                      </Button>
                    ))}
                  </>
                )}

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
                  component={NavLink}
                  to="/basket"
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    "&:hover": {
                      bgcolor: alpha(theme.palette.secondary.main, 0.2),
                    },
                  }}
                >
                  <Badge badgeContent={itemCount} color="secondary">
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
          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {getInitials(user.email)}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user.email.split("@")[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          )}

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
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                  "&.active": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <ListItemText
                  primary={title.charAt(0).toUpperCase() + title.slice(1)}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                      ".active &": {
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                      },
                    },
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
            {user ? (
              <>
                <ListItem
                  onClick={toggleMobileMenu}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonOutline fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Profile"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  />
                </ListItem>
                <ListItem
                  onClick={() => {
                    toggleMobileMenu();
                    navigate("/orders");
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <ListItemIcon>
                    <ReceiptLongOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Orders"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  />
                </ListItem>
                {user?.roles.includes("Admin") && (
                  <ListItem
                    onClick={() => {
                      toggleMobileMenu();
                      navigate("/inventory");
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Inventory2Outlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Inventory"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                      }}
                    />
                  </ListItem>
                )}
                <ListItem
                  onClick={toggleMobileMenu}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <ListItemIcon>
                    <LocationOnOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Address"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  />
                </ListItem>
                <ListItem
                  onClick={() => {
                    toggleMobileMenu();
                    handleLogout();
                  }}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: "transparent",
                    color: theme.palette.error.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.error.main, 0.05),
                    },
                  }}
                >
                  <ListItemIcon>
                    <LogoutOutlined fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: theme.palette.error.main,
                    }}
                  />
                </ListItem>
              </>
            ) : (
              <>
                {rightLinks.map(({ title, path }) => (
                  <ListItem
                    component={NavLink}
                    to={path}
                    key={path}
                    onClick={toggleMobileMenu}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                      "&.active": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <ListItemText
                      primary={title.charAt(0).toUpperCase() + title.slice(1)}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          ".active &": {
                            fontWeight: 600,
                            color: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </>
            )}
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
            <IconButton component={NavLink} to="/basket" onClick={toggleMobileMenu}>
              <Badge badgeContent={itemCount} color="secondary">
                <ShoppingCartIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
