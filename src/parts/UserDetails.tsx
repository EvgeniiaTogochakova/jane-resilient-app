import { useParams, useNavigate } from 'react-router-dom';
import { userHooks } from '@/api/users';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = userHooks.useFetchOne(id);

  if (isLoading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Card elevation={3}>
        <CardMedia component="img" height="300" image={user.avatar} alt={user.name} />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <strong>City:</strong> {user.city}
          </Typography>
          <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
            User ID: {user.id}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
