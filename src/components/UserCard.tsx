import { NavLink } from 'react-router-dom';
import {
  alpha,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type { User } from '@/api/users';

interface UserCardProps {
  user: User;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UserCard({ user, setOpen, setSelectedUser }: UserCardProps) {
  const { id, name, avatar, email, city } = user;

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          height: 160,
          width: '100%',
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.06),
          display: 'flex',
          justifyContent: 'center',
        }}>
        <CardMedia
          component="img"
          image={avatar}
          alt={name}
          sx={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://w3.org" width="100" height="100" viewBox="0 0 24 24" fill="%23ccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" noWrap gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          <strong>Email:</strong> {email}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          <strong>City:</strong> {city}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button component={NavLink} to={`/users/${id}`} size="small" startIcon={<VisibilityIcon />}>
          Details
        </Button>
        {/* Кнопка открытия модалки редактирования */}
        <IconButton
          color="primary"
          onClick={() => {
            setSelectedUser(user);
            setOpen(true);
          }}>
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
