import {useEffect, useEffectEvent} from 'react';
import {useTranslation} from 'react-i18next';

import {useNotification} from '@/app/providers';
import {
  type Chat,
  ChatAvatar,
  getChatTitle,
  getMessageTypeKey,
  type Message,
  selectInstanceApiUrl,
  selectIsInstanceSet,
  useChatStore,
  useInstanceStore,
} from '@/entities';
import {pollNotifications} from '../lib/pollNotifications';

// Держит один цикл опроса, пока задан инстанс; перезапускает при смене кредов
export const useNotificationPolling = () => {
  const {t} = useTranslation();
  const {openNotification} = useNotification();
  const isInstanceSet = useInstanceStore(selectIsInstanceSet);
  const instanceApiUrl = useInstanceStore(selectInstanceApiUrl);
  const apiTokenInstance = useInstanceStore((s) => s.apiTokenInstance);

  // Вне эффекта: свежие t и openNotification без перезапуска опроса
  const notifyIncomingMessage = useEffectEvent(
    (chat: Chat, message: Message) => {
      // Открытый чат на видимой вкладке пользователь и так видит
      const isChatOpened =
        useChatStore.getState().currentChatId === chat.chatId &&
        document.visibilityState === 'visible';

      if (isChatOpened) return;

      openNotification(
        'info',
        getChatTitle(chat),
        message.text || t(getMessageTypeKey(message.typeMessage)),
        <ChatAvatar chat={chat} />
      );
    }
  );

  useEffect(() => {
    if (!isInstanceSet) return;

    const controller = new AbortController();

    void pollNotifications(controller.signal, {
      onIncomingMessage: (chat, message) =>
        notifyIncomingMessage(chat, message),
    });

    return () => controller.abort();
  }, [isInstanceSet, instanceApiUrl, apiTokenInstance]);
};
