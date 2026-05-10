import { userHooks } from '@/api/users';
import { LinearProgress, Box, Grid, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function UserList() {
  const { data: users, isFetching } = userHooks.useFetchAll();

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* isLoading не рассматриваю, т.к. кэш уже должен быть прогрет с помощью loader */}

      {/* для фоновой дозагрузки работает isFetching */}
      {isFetching && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}

      <h1>Users</h1>

      <Grid container spacing={2}>
        {users?.map((user) => (
          //   <Card key={user.id} user={user} />
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
            <Box key={user.id}>{user.name}</Box>
          </Button>
        ))}
      </Grid>
    </Box>
  );
}
