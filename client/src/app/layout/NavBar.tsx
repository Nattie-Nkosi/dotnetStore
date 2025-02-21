import { AppBar, Toolbar, Typography } from "@mui/material";

export default function NavBar() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">Dotnet-Store</Typography>
      </Toolbar>
    </AppBar>
  );
}
