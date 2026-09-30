import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {ApiCredentials} from '@/shared';

export interface InstanceCredentials {
  apiUrl: string;
  mediaUrl: string;
  idInstance: string;
  apiTokenInstance: string;
}

interface InstanceState extends InstanceCredentials {
  setInstance: (credentials: Partial<InstanceCredentials>) => void;
  resetInstance: () => void;
}

const initialState: InstanceCredentials = {
  apiUrl: '',
  mediaUrl: '',
  idInstance: '',
  apiTokenInstance: '',
};

export const useInstanceStore = create<InstanceState>()(
  persist(
    (set) => ({
      ...initialState,
      setInstance: (credentials) => set(credentials),
      resetInstance: () => set(initialState),
    }),
    {
      name: 'green-api-instance',
      partialize: ({apiUrl, mediaUrl, idInstance, apiTokenInstance}) => ({
        apiUrl,
        mediaUrl,
        idInstance,
        apiTokenInstance,
      }),
    }
  )
);

export const selectIsInstanceSet = (state: InstanceState) =>
  Boolean(state.apiUrl && state.idInstance && state.apiTokenInstance);

export const selectInstanceApiUrl = ({apiUrl, idInstance}: InstanceState) =>
  `${apiUrl}/waInstance${idInstance}`;

// Только для getState(): возвращает новый объект, в хуке вызовет ререндер
export const getApiCredentials = (state: InstanceState): ApiCredentials => ({
  instanceApiUrl: selectInstanceApiUrl(state),
  apiTokenInstance: state.apiTokenInstance,
});
