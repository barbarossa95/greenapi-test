import type {Chat} from '../model';

export const formatPhoneNumber = (phoneNumber: number) => `+${phoneNumber}`;

// Имя чата: username, иначе имя, иначе телефон, иначе chatId
export const getChatTitle = ({chatId, username, name, phoneNumber}: Chat) =>
  username || name || (phoneNumber ? formatPhoneNumber(phoneNumber) : chatId);

// Телефон под именем показываем, только если в заголовке username
export const getChatSubtitle = ({username, phoneNumber}: Chat) =>
  username && phoneNumber ? formatPhoneNumber(phoneNumber) : undefined;

export const getChatInitial = ({username, name}: Chat) =>
  (username?.replace(/^@/, '') || name)?.charAt(0).toUpperCase() || undefined;
