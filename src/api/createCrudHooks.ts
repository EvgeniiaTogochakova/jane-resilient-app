import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';

// для дальнейшей кастомизации нотификаций
export interface CrudMessages {
  createSuccess?: string;
  createError?: string;
  updateSuccess?: string;
  updateError?: string;
  deleteSuccess?: string;
  deleteError?: string;
}

// универсальная фабрика хуков, тут учтены нотификации
export const createCrudHooks = <T extends { id: string | number }>(
  baseUrl: string,
  entity: string,
  messages?: CrudMessages,
) => {
  const api = axios.create({ baseURL: baseUrl });

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

  const useFetchAll = () => {
    return useQuery<T[]>({
      queryKey: [entity],
      queryFn: requests.fetchAll,
    });
  };

  const useFetchOne = (id: string | number | undefined) => {
    return useQuery<T>({
      queryKey: [entity, id],
      queryFn: () => requests.fetchOne(id!),
      enabled: !!id,
    });
  };

  const useCreate = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
      mutationFn: async (data: Partial<T>) => {
        const response: AxiosResponse<T> = await api.post(`/${entity}`, data);
        return response.data;
      },
      // созданный объект становится data
      onSuccess: (data) => {
        // инвалидируем общий список
        queryClient.invalidateQueries({ queryKey: [entity] });

        // пишем данные в кэш конкретной сущности по id
        // loader не будет делать лишний сетевой запрос, а мы сможем сразу перейти на страницу конкретной сущности
        queryClient.setQueryData([entity, String(data.id)], data);

        if (messages?.createSuccess) {
          enqueueSnackbar(messages.createSuccess, { variant: 'success' });
        }
      },
      onError: () => {
        if (messages?.createError) {
          enqueueSnackbar(messages.createError, { variant: 'error' });
        }
      },
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
      mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
        const response: AxiosResponse<T> = await api.put(`/${entity}/${id}`, data);
        return response.data;
      },

      onSuccess: (updatedItem) => {
        // сразу обновляем кэш конкретной карточки
        // не будет лишнего сетевого запроса, если после редактирования сущности надо будет перейти на ее страницу
        queryClient.setQueryData([entity, String(updatedItem.id)], updatedItem);

        // сразу обновляем этот элемент внутри закэшированного списка
        queryClient.setQueryData<T[]>([entity], (oldList) => {
          if (!oldList) return [];
          // мапим старый список: заменяем элемент с нужным id на новые данные от сервера
          return oldList.map((item) =>
            String(item.id) === String(updatedItem.id) ? updatedItem : item,
          );
        });

        // делаем инвалидацию общего списка для синхронизации с сервером
        queryClient.invalidateQueries({ queryKey: [entity] });

        if (messages?.updateSuccess) {
          enqueueSnackbar(messages.updateSuccess, { variant: 'success' });
        }
      },

      onError: () => {
        if (messages?.updateError) {
          enqueueSnackbar(messages.updateError, { variant: 'error' });
        }
      },
    });
  };

  const useDelete = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
      mutationFn: async (id: string | number) => {
        await api.delete(`/${entity}/${id}`);
        return id; // возвращаем id, чтобы использовать его в onSuccess
      },
      onSuccess: (deletedId) => {
        // сразу же убираем пользователя из кэша списка
        queryClient.setQueryData<T[]>([entity], (oldList) => {
          if (!oldList) return [];
          return oldList.filter((item) => String(item.id) !== String(deletedId));
        });

        // стираем кэш этой карточки
        queryClient.removeQueries({ queryKey: [entity, String(deletedId)] });

        // ивалидация для синхронизации с сервером
        queryClient.invalidateQueries({ queryKey: [entity] });

        if (messages?.deleteSuccess) {
          enqueueSnackbar(messages.deleteSuccess, { variant: 'success' });
        }
      },
      onError: () => {
        if (messages?.deleteError) {
          enqueueSnackbar(messages.deleteError, { variant: 'error' });
        }
      },
    });
  };

  return {
    requests,
    useFetchAll,
    useFetchOne,
    useCreate,
    useUpdate,
    useDelete,
  };
};
