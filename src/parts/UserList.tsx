import React from 'react';
import { useSearchParams, useNavigation, useNavigate } from 'react-router-dom';
import { Box, Button, LinearProgress, Pagination, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { matchSorter } from 'match-sorter';
import sortBy from 'sort-by';
import { userHooks, type User } from '@/api/users';
import SearchSort from '@/components/SearchSort';
import UserModal from '@/components/UserModal';
import UserCard from '@/components/UserCard';

const ITEMS_PER_PAGE = 6; // Константа для пагинации (по 6 карточек)

export default function UserList() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { mutate: createUser } = userHooks.useCreate();
  const { mutate: updateUser } = userHooks.useUpdate();

  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Параметры из URL
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'name';
  const page = parseInt(searchParams.get('page') || '1', 10);

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

  // Расчет пагинации
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Нарезаем отсортированный массив под текущую страницу
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // Обработчик клика по кнопкам пагинации
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', value.toString());
    navigate(`/?${newParams.toString()}`);
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

      {/* Если после фильтрации никого не нашли */}
      {paginatedUsers.length === 0 && !isFetching && (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 4 }}>
          No users found matching your criteria.
        </Typography>
      )}

      <Box
        sx={{
          bgcolor: 'pink',
          width: '100%',
          display: 'grid',
          gap: 3,
          mb: 4,
          // Адаптивная сетка под лимит в 6 карточек:
          gridTemplateColumns: {
            xs: '1fr', // Мобильные: 1 колонка
            sm: 'repeat(2, 1fr)', // Планшеты: 2 колонки
            md: 'repeat(3, 1fr)', // Десктопы: 3 колонки
          },
        }}>
        {paginatedUsers.map((user: User) => (
          <UserCard key={user.id} user={user} setOpen={setOpen} setSelectedUser={setSelectedUser} />
        ))}
      </Box>

      {/* Пагинация отображается, только если страниц больше одной */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
