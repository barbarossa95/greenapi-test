import {mutationOptions, queryOptions} from '@tanstack/react-query';
import type {AxiosError} from 'axios';

import type {
  ApiMutationKey,
  ApiQueryKey,
  DataOf,
  MutationEndpoint,
  PathOf,
  QueryEndpoint,
  ResponseOf,
} from './endpoints';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError;
  }
}

// data можно не передавать, если у эндпоинта нет данных или все поля опциональны
type QueryArgs<E extends QueryEndpoint> = [DataOf<E>] extends [void]
  ? [data?: undefined, ...path: PathOf<E>]
  : object extends DataOf<E>
    ? [data?: DataOf<E>, ...path: PathOf<E>]
    : [data: DataOf<E>, ...path: PathOf<E>];

// Только ключ и типы: запрос выполняет дефолтный queryFn клиента
export const apiQuery = <E extends QueryEndpoint>(
  endpoint: E,
  ...[data, ...path]: QueryArgs<E>
) =>
  queryOptions<ResponseOf<E>, AxiosError, ResponseOf<E>, ApiQueryKey<E>>({
    queryKey: [endpoint, data, ...path] as ApiQueryKey<E>,
  });

// Только ключ и типы: запрос выполняет дефолтный mutationFn клиента
export const apiMutation = <E extends MutationEndpoint>(
  endpoint: E,
  ...path: PathOf<E>
) =>
  mutationOptions<ResponseOf<E>, AxiosError, DataOf<E>>({
    mutationKey: [endpoint, ...path] as ApiMutationKey<E>,
  });
