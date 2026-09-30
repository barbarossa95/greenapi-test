import {QueryClient} from '@tanstack/react-query';

import {
  getApiCredentials,
  selectIsInstanceSet,
  useInstanceStore,
} from '@/entities';
import {type ApiMutationKey, type ApiQueryKey, apiRequest} from '@/shared';

// Креды читаются в момент запроса, поэтому всегда актуальны
const getCredentials = () => getApiCredentials(useInstanceStore.getState());

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 60000,
      // Не делаем запросы, пока инстанс не задан
      enabled: () => selectIsInstanceSet(useInstanceStore.getState()),
      queryFn: ({queryKey, signal}) => {
        const [endpoint, data, ...path] = queryKey as ApiQueryKey;
        return apiRequest(getCredentials(), endpoint, data, path, signal);
      },
    },
    mutations: {
      mutationFn: (variables, {mutationKey}) => {
        if (!mutationKey) {
          throw new Error('mutationKey is required for the default mutationFn');
        }
        const [endpoint, ...path] = mutationKey as ApiMutationKey;
        return apiRequest(getCredentials(), endpoint, variables, path);
      },
    },
  },
});

// Сбрасываем кэш при смене инстанса: данные другого инстанса не должны остаться
useInstanceStore.subscribe((state, prev) => {
  if (
    state.apiUrl !== prev.apiUrl ||
    state.idInstance !== prev.idInstance ||
    state.apiTokenInstance !== prev.apiTokenInstance
  ) {
    void queryClient.resetQueries();
  }
});
