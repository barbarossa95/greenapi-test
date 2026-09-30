import {getApiCredentials, useInstanceStore} from '@/entities';
import {apiRequest, type ResponseOf} from '@/shared';

import {handleNotification} from './handleNotification';

// Long polling: сервер держит запрос до RECEIVE_TIMEOUT_S секунд (лимит 5–60)
const RECEIVE_TIMEOUT_S = 20;
const MAX_BACKOFF_MS = 30_000;

// Пауза, которую прерывает abort
const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      {once: true}
    );
  });

// Цикл: получить -> обработать -> удалить. Работает до abort
export const pollNotifications = async (signal: AbortSignal) => {
  let failures = 0;

  while (!signal.aborted) {
    try {
      const credentials = getApiCredentials(useInstanceStore.getState());

      const notification = await apiRequest<ResponseOf<'receiveNotification'>>(
        credentials,
        'receiveNotification',
        {receiveTimeout: RECEIVE_TIMEOUT_S},
        [],
        signal
      );

      failures = 0;

      // За таймаут ничего не пришло
      if (!notification) continue;

      // Ошибка обработки не должна блокировать очередь
      try {
        handleNotification(notification.body);
      } catch (error) {
        console.error('Failed to handle notification', notification, error);
      }

      // Без удаления receiveNotification будет возвращать это же уведомление
      await apiRequest<ResponseOf<'deleteNotification'>>(
        credentials,
        'deleteNotification',
        undefined,
        [notification.receiptId],
        signal
      );
    } catch (error) {
      if (signal.aborted) return;

      failures++;
      console.error('Notification polling failed', error);

      // Экспоненциальная пауза: 1с, 2с, 4с ... 30с
      await sleep(Math.min(1000 * 2 ** (failures - 1), MAX_BACKOFF_MS), signal);
    }
  }
};
