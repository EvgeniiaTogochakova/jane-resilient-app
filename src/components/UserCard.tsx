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
  Skeleton,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type { User } from '@/api/users';
import React from 'react';

interface UserCardProps {
  user: User;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UserCard({ user, setOpen, setSelectedUser }: UserCardProps) {
  const [imgLoading, setImgLoading] = React.useState(true);
  const [imgError, setImgError] = React.useState(false);

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
          position: 'relative',
        }}>
        {imgError ? (
          <AccountCircleIcon
            sx={{ fontSize: 140, color: (theme) => alpha(theme.palette.primary.main, 0.5) }}
          />
        ) : (
          <>
            {imgLoading && (
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              />
            )}

            <CardMedia
              component="img"
              image={avatar}
              alt={name}
              sx={{
                height: '100%',
                width: 'auto',
                objectFit: 'contain',
                display: imgLoading ? 'none' : 'block',
              }}
              onLoad={() => setImgLoading(false)}
              onError={() => {
                setImgLoading(false);
                setImgError(true);
              }}
            />
          </>
        )}
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
