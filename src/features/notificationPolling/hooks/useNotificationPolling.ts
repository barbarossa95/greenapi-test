import {useEffect} from 'react';

import {
  selectInstanceApiUrl,
  selectIsInstanceSet,
  useInstanceStore,
} from '@/entities';
import {pollNotifications} from '../lib/pollNotifications';

// Держит один цикл опроса, пока задан инстанс; перезапускает при смене кредов
export const useNotificationPolling = () => {
  const isInstanceSet = useInstanceStore(selectIsInstanceSet);
  const instanceApiUrl = useInstanceStore(selectInstanceApiUrl);
  const apiTokenInstance = useInstanceStore((s) => s.apiTokenInstance);

  useEffect(() => {
    if (!isInstanceSet) return;

    const controller = new AbortController();

    void pollNotifications(controller.signal);

    return () => controller.abort();
  }, [isInstanceSet, instanceApiUrl, apiTokenInstance]);
};
