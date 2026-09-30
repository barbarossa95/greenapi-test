import axios from 'axios';

import {resolveApiBaseUrl} from '../lib/resolveApiAssetUrl';

const instance = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Типизированный метод request
export const request = <T>(
  ...args: Parameters<typeof instance.request>
): Promise<T> => {
  return instance.request(...args).then((response) => response.data);
};
