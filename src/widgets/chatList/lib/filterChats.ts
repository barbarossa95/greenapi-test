import type {Chat} from '@/entities';

// Поиск без учёта регистра по username, имени и по цифрам телефона
const matchesQuery = (chat: Chat, text: string, digits: string) =>
  Boolean(
    chat.username?.toLowerCase().includes(text) ||
    chat.name?.toLowerCase().includes(text) ||
    (digits && chat.phoneNumber && String(chat.phoneNumber).includes(digits))
  );

export const filterChats = (chats: Chat[], query: string) => {
  const text = query.trim().toLowerCase();

  if (!text) return chats;

  // "+7 (987) 654" -> "7987654"
  const digits = text.replace(/\D/g, '');

  return chats.filter((chat) => matchesQuery(chat, text, digits));
};
