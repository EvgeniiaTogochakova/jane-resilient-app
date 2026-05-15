import React from 'react';
import { useSearchParams, useNavigation, NavLink } from 'react-router-dom';
import { Box, Button, Grid, IconButton, LinearProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import { userHooks, type User } from '@/api/users';
import SearchSort from '@/components/SearchSort';
import UserModal from '@/components/UserModal';

export default function UserList() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const { mutate: createUser } = userHooks.useCreate();
  const { mutate: updateUser } = userHooks.useUpdate();

  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Параметры из URL
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'name';

  //  Данные из TanStack Query, берем из прогретого кэша
  const { data: allUsers = [], isFetching } = userHooks.useFetchAll();

  // Обновляется ли сейчас страница в связи с изменением поискового параметра q
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');

  // Фильтрация и сортировка
  const filteredUsers = q
    ? matchSorter(allUsers, q, { keys: ['name', 'email', 'city'] })
    : allUsers;

  const sortedUsers = [...filteredUsers].sort(sortBy(sort));

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
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
    <Box sx={{ width: '100%', p: 3, position: 'relative' }}>
      {/* isFetching - фоновая дозагрузка, searching - это пользовательский поиск */}
      {(isFetching || searching) && (
        <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
      )}
      <Typography variant="h2" gutterBottom>
        Users
      </Typography>
      <SearchSort q={q} sort={sort} searching={!!searching} />
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
        {sortedUsers?.map((user) => (
          <Box key={user.id}>
            <Button component={NavLink} to={`/users/${user.id}`}>
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
