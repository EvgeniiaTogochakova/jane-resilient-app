import { Outlet, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container } from '@mui/material';

export default function App() {
  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button
            component={NavLink}
            to="/"
            end
            sx={{ mr: 2, '&.active': { fontWeight: 'bold', color: 'primary.main' } }}>
            All Users
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{ my: 4, bgcolor: 'azure', border: '2px dashed blue', borderRadius: 2, p: 2 }}>
        <Outlet />
      </Container>
    </>
  );
}
