import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Typography, Container, Box, Button } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // Ошибка от самого роутера (например, 404)
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    // Обычная JS ошибка
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <Container>
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h3" color="error" gutterBottom>
          Oops!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Sorry, an unexpected error has occurred.
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', mt: 2 }} gutterBottom>
          {errorMessage}
        </Typography>
        <Button variant="contained" component={Link} to="/">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
