import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, type LoaderFunctionArgs } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import App from '@/App';
import ErrorPage from '@/error-page';
import { userHooks } from '@/api/users';
import UserList from '@/parts/UserList';
import UserDetails from '@/parts/UserDetails';
import axios from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// loader для получения всех пользователей, но он только греет кэш, а данные компоненту дает tanstack

const usersLoader = (queryClient: QueryClient) => async () => {
  await queryClient.ensureQueryData({
    queryKey: ['users'],
    queryFn: userHooks.requests.fetchAll,
  });
  return null;
};

// loader для получения конкретного пользователя

export const userDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.id;

    if (!id || id.trim() === '') {
      throw Response.json({ message: 'User ID is missing' }, { status: 400 });
    }

    if (!/^\d+$/.test(id)) {
      throw Response.json({ message: 'User not found' }, { status: 404 });
    }

    try {
      // Прогреваем кэш TanStack Query, отключая повторные попытки
      await queryClient.ensureQueryData({
        queryKey: ['users', id],
        queryFn: () => userHooks.requests.fetchOne(id),
        retry: false,
      });
    } catch (error) {
      // Если mockapi ответил, что юзера нет в базе
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw Response.json({ message: 'User not found' }, { status: 404 });
      }

      // Любая другая серверная ошибка
      throw Response.json({ message: 'Failed to load user data' }, { status: 500 });
    }

    return null;
  };

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <UserList />,
        loader: usersLoader(queryClient),
      },
      {
        path: 'users/:id',
        element: <UserDetails />,
        loader: userDetailsLoader(queryClient),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <RouterProvider router={router} />{' '}
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
