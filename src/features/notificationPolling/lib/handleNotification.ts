import {
  type Chat,
  type Message,
  type MessageStatus,
  useChatStore,
  useMessageStore,
} from '@/entities';
import type {
  MessageNotification,
  NotificationBody,
  OutgoingMessageStatus,
} from '@/shared';

// noAccount, notInGroup, suspended и т.п. для пользователя = не отправлено
const STATUS_MAP: Record<OutgoingMessageStatus, MessageStatus> = {
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed',
  noAccount: 'failed',
  notInGroup: 'failed',
  suspended: 'failed',
  yellowCard: 'failed',
};

export interface NotificationHandlers {
  // Новое входящее сообщение уже в сторе
  onIncomingMessage?: (chat: Chat, message: Message) => void;
}

const handleMessage = (
  {
    typeWebhook,
    idMessage,
    timestamp,
    senderData,
    messageData,
  }: MessageNotification,
  {onIncomingMessage}: NotificationHandlers
) => {
  const {chatId} = senderData;
  const chat = useChatStore.getState().chats.get(chatId);

  // Обрабатываем только сообщения чатов из списка, остальные пропускаем
  if (!chat) return;

  const isIncoming = typeWebhook === 'incomingMessageReceived';

  const message: Message = {
    idMessage,
    chatId,
    type: isIncoming ? 'incoming' : 'outgoing',
    text:
      messageData.typeMessage === 'textMessage'
        ? messageData.textMessageData.textMessage
        : '',
    typeMessage: messageData.typeMessage,
    timestamp,
    status: isIncoming ? undefined : 'sent',
  };

  const messagesBefore = useMessageStore.getState().messages;

  useMessageStore.getState().addMessage(message);

  // Повторное сообщение addMessage пропускает, и Map в сторе остаётся прежним:
  // так одно сообщение не показывается пользователю дважды
  const isNewMessage = useMessageStore.getState().messages !== messagesBefore;

  if (isIncoming && isNewMessage) {
    onIncomingMessage?.(chat, message);
  }
};

export const handleNotification = (
  body: NotificationBody,
  handlers: NotificationHandlers = {}
) => {
  switch (body.typeWebhook) {
    case 'incomingMessageReceived':
    case 'outgoingMessageReceived':
    case 'outgoingAPIMessageReceived':
      handleMessage(body, handlers);
      return;
    case 'outgoingMessageStatus':
      // Статусы тоже только для чатов из списка
      if (!useChatStore.getState().chats.has(body.chatId)) return;

      useMessageStore
        .getState()
        .updateMessageStatus(
          body.chatId,
          body.idMessage,
          STATUS_MAP[body.status] ?? 'failed'
        );
      return;
    default:
      // Остальные уведомления просто удаляются из очереди
      return;
  }
};
