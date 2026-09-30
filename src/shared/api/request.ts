import axios from 'axios';

import {type Endpoint, endpoints} from './endpoints';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiCredentials {
  instanceApiUrl: string;
  apiTokenInstance: string;
}

// Запрос вида {instanceApiUrl}/{endpoint}/{apiTokenInstance}[/...path]
export const apiRequest = <T>(
  {instanceApiUrl, apiTokenInstance}: ApiCredentials,
  endpoint: Endpoint,
  data?: unknown,
  path: readonly unknown[] = [],
  signal?: AbortSignal
): Promise<T> => {
  const {method} = endpoints[endpoint];

  return instance
    .request<T>({
      method,
      url: [instanceApiUrl, endpoint, apiTokenInstance, ...path].join('/'),
      // GET: данные в query-параметры, остальное: в тело
      ...(method === 'GET' ? {params: data} : {data}),
      signal,
    })
    .then((response) => response.data);
};
