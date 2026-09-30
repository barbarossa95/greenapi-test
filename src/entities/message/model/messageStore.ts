import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {createSuperjsonStorage} from '@/shared';

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  idMessage: string;
  chatId: string;
  type: 'incoming' | 'outgoing';
  // Пустой для нетекстовых сообщений
  text: string;
  // typeMessage из GREEN-API
  typeMessage?: string;
  // UNIX-время в секундах, как в GREEN-API
  timestamp: number;
  status?: MessageStatus;
}

interface Messages {
  // chatId -> сообщения чата по возрастанию timestamp
  messages: Map<string, Message[]>;
}

interface MessageState extends Messages {
  addMessage: (message: Message) => void;
  updateMessageStatus: (
    chatId: string,
    idMessage: string,
    status: MessageStatus
  ) => void;
  setChatMessages: (chatId: string, messages: Message[]) => void;
  deleteChatMessages: (chatId: string) => void;
  resetMessages: () => void;
}

const STATUS_ORDER: MessageStatus[] = ['sent', 'delivered', 'read'];

// Статус не откатывается назад (read -> delivered), failed применяется всегда
const canUpdateStatus = (
  current: MessageStatus | undefined,
  next: MessageStatus
) => {
  if (next === current) return false;
  if (next === 'failed') return true;
  if (current === 'failed') return false;

  return STATUS_ORDER.indexOf(next) > STATUS_ORDER.indexOf(current ?? 'sent');
};

// Индекс для вставки с сохранением порядка по timestamp
const findInsertIndex = (messages: Message[], timestamp: number) => {
  let index = messages.length;

  while (index > 0 && messages[index - 1].timestamp > timestamp) {
    index--;
  }

  return index;
};

const initialState: Messages = {
  messages: new Map<string, Message[]>(),
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      ...initialState,
      addMessage: (message) =>
        set((state) => {
          const chatMessages = state.messages.get(message.chatId) ?? [];

          // Одно и то же сообщение может прийти повторно
          if (chatMessages.some((m) => m.idMessage === message.idMessage)) {
            return state;
          }

          // Уведомления могут приходить не по порядку: вставляем по timestamp
          const next = [...chatMessages];

          next.splice(findInsertIndex(next, message.timestamp), 0, message);

          return {messages: new Map(state.messages).set(message.chatId, next)};
        }),
      updateMessageStatus: (chatId, idMessage, status) =>
        set((state) => {
          const chatMessages = state.messages.get(chatId);
          const current = chatMessages?.find((m) => m.idMessage === idMessage);

          if (
            !chatMessages ||
            !current ||
            !canUpdateStatus(current.status, status)
          ) {
            return state;
          }

          return {
            messages: new Map(state.messages).set(
              chatId,
              chatMessages.map((m) =>
                m.idMessage === idMessage ? {...m, status} : m
              )
            ),
          };
        }),
      setChatMessages: (chatId, messages) =>
        set((state) => ({
          messages: new Map(state.messages).set(chatId, messages),
        })),
      deleteChatMessages: (chatId) =>
        set((state) => {
          const next = new Map(state.messages);

          next.delete(chatId);

          return {messages: next};
        }),
      resetMessages: () => set(initialState),
    }),
    {
      name: 'green-api-messages',
      storage: createSuperjsonStorage<MessageState>(),
    }
  )
);

// Стабильная ссылка: новый [] в селекторе вызывает бесконечный ререндер
const EMPTY_MESSAGES: Message[] = [];

export const selectChatMessages =
  (chatId: string | undefined) => (state: MessageState) =>
    (chatId && state.messages.get(chatId)) || EMPTY_MESSAGES;

// Сообщения чата уже есть в сторе (в том числе пустой список)
export const selectHasChatMessages =
  (chatId: string | undefined) => (state: MessageState) =>
    Boolean(chatId && state.messages.has(chatId));
