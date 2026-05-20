import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  alpha,
  Skeleton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { userHooks, type User } from '@/api/users';
import UserModal from '@/components/UserModal';
import UserDeleteModal from '@/components/UserDeleteModal';

export default function UserDetails() {
  const [imgLoading, setImgLoading] = React.useState(true);
  const [imgError, setImgError] = React.useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user } = userHooks.useFetchOne(id);

  const { mutate: updateUser, isPending: isUpdating } = userHooks.useUpdate();

  const { mutate: deleteUser, isPending: isDeleting } = userHooks.useDelete();

  const [editOpen, setEditOpen] = React.useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleClose = () => {
    setEditOpen(false);
  };

  const handleFormSubmit = (data: Partial<User>) => {
    if (user) {
      updateUser(
        { id: user.id, data },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (user) {
      deleteUser(user.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          navigate('/', { replace: true });
        },
      });
    }
  };

  if (!user) return <Typography variant="h2">User not found</Typography>;

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
          Edit Profile
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)} // Открываем модалку удаления
          disabled={isDeleting}>
          Delete User
        </Button>
      </Box>

      {/* Передаем объект user, чтобы модалка на редактирование была заполненной */}
      {user && (
        <UserModal
          open={editOpen}
          user={user}
          onClose={() => setEditOpen(false)}
          onSubmit={handleFormSubmit}
          isFormSubmitting={isUpdating}
        />
      )}

      {/* Это вызов модалки на удаление */}
      {user && (
        <UserDeleteModal
          open={deleteDialogOpen}
          userName={user.name}
          isDeleting={isDeleting}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {user && (
        <Card elevation={3}>
          <Box
            sx={{
              height: 300,
              width: '100%',
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.06),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}>
            {imgError ? (
              <AccountCircleIcon
                sx={{ fontSize: 200, color: (theme) => alpha(theme.palette.primary.main, 0.5) }}
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
                  image={user.avatar}
                  alt={user.name}
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'contain',
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
      )}
    </Box>
  );
}
