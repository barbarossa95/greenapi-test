import type {HistoryMessage} from '@/shared';
import type {Message} from '../model';

// Сообщение из getChatHistory в формат стора
export const fromHistoryMessage = (message: HistoryMessage): Message => ({
  idMessage: message.idMessage,
  chatId: message.chatId,
  type: message.type,
  text:
    message.typeMessage === 'textMessage' ? (message.textMessage ?? '') : '',
  typeMessage: message.typeMessage,
  timestamp: message.timestamp,
  status: message.type === 'outgoing' ? message.statusMessage : undefined,
});

// Объединение без дублей по idMessage, по возрастанию timestamp.
// При совпадении побеждает версия из current: она свежее (статусы из уведомлений)
export const mergeMessages = (history: Message[], current: Message[]) => {
  const byId = new Map(history.map((m) => [m.idMessage, m]));

  current.forEach((m) => byId.set(m.idMessage, m));

  return Array.from(byId.values()).sort((a, b) => a.timestamp - b.timestamp);
};
