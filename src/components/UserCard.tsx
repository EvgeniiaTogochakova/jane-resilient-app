import { NavLink } from 'react-router-dom';
import {
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
      <CardMedia component="img" height="160" image={avatar} alt={name} />
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
