import { Outlet, NavLink, useNavigation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, LinearProgress } from '@mui/material';
import { useIsFetching } from '@tanstack/react-query';

export default function App() {
  const navigation = useNavigation();

  // Глобальный счетчик активных запросов TanStack Query.
  // Если он больше 0, значит какая-то страница прямо сейчас делает какой-нибудь fetch
  const globalIsFetching = useIsFetching();

  // Проверяем, идет ли навигация или поиск через React Router
  const routerLoading = navigation.state === 'loading';

  // Показываем прогресс, если хоть что-то загружается
  const showProgress = globalIsFetching > 0 || routerLoading;

  return (
    <>
      <AppBar
        position="sticky"
        sx={(theme) => ({
          background: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%)`,
          position: 'relative',
        })}>
        <Toolbar>
          <Button
            component={NavLink}
            color="inherit"
            to="/"
            end
            sx={{ mr: 2, '&.active': { fontWeight: 'bold', color: 'white' } }}>
            All Users
          </Button>
        </Toolbar>
        {showProgress && (
          <LinearProgress
            color="secondary"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
            }}
          />
        )}
      </AppBar>

      <Container maxWidth="lg" sx={{ my: 4, p: 2, boxShadow: 10 }}>
        <Outlet />
      </Container>
    </>
  );
}
