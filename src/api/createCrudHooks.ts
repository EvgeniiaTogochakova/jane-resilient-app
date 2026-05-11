import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';

export const createCrudHooks = <T extends { id: string | number }>(
  baseUrl: string,
  entity: string,
) => {
  const api = axios.create({
    baseURL: baseUrl,
  });

  // Чистые функции запросов (без хуков) для использования в loaders
  const requests = {
    fetchAll: async (): Promise<T[]> => {
      const response: AxiosResponse<T[]> = await api.get(`/${entity}`);
      return response.data;
    },
    fetchOne: async (id: string | number): Promise<T> => {
      const response: AxiosResponse<T> = await api.get(`/${entity}/${id}`);
      return response.data;
    },
  };

  // Получить всё
  const useFetchAll = () => {
    return useQuery<T[]>({
      queryKey: [entity],
      queryFn: requests.fetchAll, // Используем функцию из requests
    });
  };

  // Получить один по ID
  const useFetchOne = (id: string | number | undefined) => {
    return useQuery<T>({
      queryKey: [entity, id],
      queryFn: () => requests.fetchOne(id!),
      enabled: !!id,
    });
  };

  // Создать
  const useCreate = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
      mutationFn: async (data: Partial<T>) => {
        const response: AxiosResponse<T> = await api.post(`/${entity}`, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entity] });
        enqueueSnackbar('Пользователь успешно создан', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Ошибка при создании пользователя!', { variant: 'error' });
      },
    });
  };

  // Обновить
  const useUpdate = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
      mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
        const response: AxiosResponse<T> = await api.put(`/${entity}/${id}`, data);
        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: [entity] });
        queryClient.invalidateQueries({ queryKey: [entity, data.id] });
        enqueueSnackbar('Пользователь успешно обновлен', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Ошибка при обновлении пользователя!', { variant: 'error' });
      },
    });
  };

  // Удалить
  const useDelete = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
      mutationFn: async (id: string | number) => {
        await api.delete(`/${entity}/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entity] });
        enqueueSnackbar('Пользователь успешно удален', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Ошибка при удалении пользователя!', { variant: 'error' });
      },
    });
  };

  return {
    requests, // Экспортируем чистые функции для loaders
    useFetchAll,
    useFetchOne,
    useCreate,
    useUpdate,
    useDelete,
  };
};
