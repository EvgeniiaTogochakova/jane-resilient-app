import { userHooks } from '@/api/users';

function App() {
  const { data: users, isLoading, isError, error } = userHooks.useFetchAll();

  if (isLoading) return <div>Загружаем юзеров...</div>;
  if (isError) return <div>Ошибка: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default App;
