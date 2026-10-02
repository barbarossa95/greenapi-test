import type {TranslationKey} from '@/shared';

// Подпись для нетекстовых сообщений по typeMessage
const MESSAGE_TYPE_KEYS: Partial<Record<string, TranslationKey>> = {
  imageMessage: 'message-type-image',
  videoMessage: 'message-type-video',
  documentMessage: 'message-type-document',
  audioMessage: 'message-type-audio',
  stickerMessage: 'message-type-sticker',
  locationMessage: 'message-type-location',
  contactMessage: 'message-type-contact',
  pollMessage: 'message-type-poll',
  reactionMessage: 'message-type-reaction',
};

export const getMessageTypeKey = (typeMessage?: string): TranslationKey =>
  MESSAGE_TYPE_KEYS[typeMessage ?? ''] ?? 'message-type-unknown';
