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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// loader для списка пользователей
const usersLoader = (queryClient: QueryClient) => async () => {
  return await queryClient.ensureQueryData({
    queryKey: ['users'],
    queryFn: userHooks.requests.fetchAll, // Берем из requests
  });
};

// loader для деталей (по одному пользователю, с id)

const userDetailsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const id = params.id;

    if (!id) throw new Error('No ID provided');

    return await queryClient.ensureQueryData({
      queryKey: ['users', id],
      queryFn: () => userHooks.requests.fetchOne(id), // Тоже берем из requests
    });
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
