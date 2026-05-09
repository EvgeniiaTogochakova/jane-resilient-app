import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axios, { type AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';

// Функция для создания CRUD-хуков (Factory)

export const createCrudHooks = <T extends { id: string | number }>(
  baseUrl: string,
  entity: string,
) => {
  const api = axios.create({
    baseURL: baseUrl,
  });

  // 1. Получить всё (GET)
  const useFetchAll = () => {
    return useQuery<T[]>({
      queryKey: [entity],
      queryFn: async () => {
        const response: AxiosResponse<T[]> = await api.get(`/${entity}`);
        return response.data;
      },
    });
  };

  // 2. Получить один по ID (GET)
  const useFetchOne = (id: string | number | undefined) => {
    return useQuery<T>({
      queryKey: [entity, id],
      queryFn: async () => {
        const response: AxiosResponse<T> = await api.get(`/${entity}/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // 3. Создать (POST)
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

  // 4. Обновить (PUT)
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

  // 5. Удалить (DELETE)
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
    useFetchAll,
    useFetchOne,
    useCreate,
    useUpdate,
    useDelete,
  };
};
