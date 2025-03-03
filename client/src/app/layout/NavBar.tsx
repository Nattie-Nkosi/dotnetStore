import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { NavLink } from "react-router-dom";

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

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          component={NavLink}
          to="/"
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          Dotnet-Store
        </Typography>
        <List sx={{ display: "flex", gap: 2 }}>
          {midLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={{ color: theme.palette.text.primary, typography: "h6" }}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <List sx={{ display: "flex", gap: 2 }}>
          {rightLinks.map(({ title, path }) => (
            <ListItem
              component={NavLink}
              to={path}
              key={path}
              sx={{ color: theme.palette.text.primary, typography: "h6" }}
            >
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={onThemeChange}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton>
            <Badge badgeContent={4} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
