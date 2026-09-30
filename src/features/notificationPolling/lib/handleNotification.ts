import {type MessageStatus, useChatStore, useMessageStore} from '@/entities';
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

const handleMessage = ({
  typeWebhook,
  idMessage,
  timestamp,
  senderData,
  messageData,
}: MessageNotification) => {
  const {chatId, chatName, chatType, senderPhoneNumber} = senderData;
  const isIncoming = typeWebhook === 'incomingMessageReceived';
  const {chats, addChat} = useChatStore.getState();

  // Новый чат появляется в списке с первым сообщением
  if (!chats.has(chatId)) {
    addChat({
      chatId,
      name: chatName || undefined,
      // В исходящих senderPhoneNumber: наш собственный номер
      phoneNumber:
        isIncoming && chatType === 'user' && senderPhoneNumber
          ? senderPhoneNumber
          : undefined,
    });
  }

  useMessageStore.getState().addMessage({
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
  });
};

export const handleNotification = (body: NotificationBody) => {
  switch (body.typeWebhook) {
    case 'incomingMessageReceived':
    case 'outgoingMessageReceived':
    case 'outgoingAPIMessageReceived':
      handleMessage(body);
      return;
    case 'outgoingMessageStatus':
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
