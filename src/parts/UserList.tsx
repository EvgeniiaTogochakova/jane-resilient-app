import React from 'react';
import { LinearProgress, Box, Grid, Button, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { NavLink } from 'react-router-dom';
import UserModal from '@/components/UserModal';
import { userHooks, type User } from '@/api/users';

export default function UserList() {
  const { data: users, isFetching } = userHooks.useFetchAll();
  const { mutate: createUser } = userHooks.useCreate();
  const { mutate: updateUser } = userHooks.useUpdate();

  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = (data: Partial<User>) => {
    if (selectedUser) {
      updateUser({ id: selectedUser.id, data });
    } else {
      createUser(data);
    }
    handleClose();
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* isLoading не рассматриваю, т.к. кэш уже должен быть прогрет с помощью loader */}

      {/* для фоновой дозагрузки работает isFetching */}
      {isFetching && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}

      <Typography variant="h2" gutterBottom>
        Users
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)} // Откроет пустую модалку - на создание пользователя
        sx={{ mb: 3 }}>
        Add New User
      </Button>

      <UserModal
        key={selectedUser?.id || 'new'}
        open={open}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />

      <Grid container spacing={2}>
        {users?.map((user) => (
          //   <Card key={user.id} user={user} />
          <Box key={user.id}>
            <Button
              component={NavLink}
              to={`/users/${user.id}`}
              // sx={{
              //   '&.active': {
              //     backgroundColor: 'rgba(25, 118, 210, 0.12)',
              //     borderBottom: '2px solid #1976d2',
              //   },
              // }}
            >
              {user.name}
            </Button>
            <IconButton
              onClick={() => {
                setSelectedUser(user);
                setOpen(true); // Откроет заполненную модалку - на редактирование пользователя
              }}>
              <EditIcon />
            </IconButton>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
