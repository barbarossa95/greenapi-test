// DTO GREEN-API (Telegram): https://green-api.com/telegram/docs/api/

// checkAccount
interface CheckAccountOptions {
  // Игнорировать кэш
  force?: boolean;
}

// Нужен либо phoneNumber, либо username
export type CheckAccountRequest = CheckAccountOptions &
  (
    | {phoneNumber: number; username?: never}
    | {username: `@${string}`; phoneNumber?: never}
  );

export type CheckAccountResponse =
  | {
      exist: true;
      chatId: string;
      username?: string;
      phoneNumber?: number;
      fromCache: boolean;
    }
  | {exist: false; chatId: ''};

// sendMessage
export type TypingType =
  | 'text'
  | 'record_voice_note'
  | 'upload_voice_note'
  | 'record_video_note'
  | 'upload_video_note'
  | 'record_video'
  | 'upload_video'
  | 'upload_photo'
  | 'upload_document'
  | 'choose_sticker'
  | 'choose_location'
  | 'choose_contact';

export interface SendMessageRequest {
  chatId: string;
  // До 4096 символов
  message: string;
  // id сообщения, на которое отвечаем
  quotedMessageId?: string;
  // Длительность индикатора набора, 1000–20000 мс
  typingTime?: number;
  typingType?: TypingType;
}

export interface SendMessageResponse {
  idMessage: string;
}

// receiveNotification
export interface ReceiveNotificationRequest {
  // Таймаут ожидания уведомления, 5–60 с (по умолчанию 5)
  receiveTimeout?: number;
}

export type ChatType = 'user' | 'group' | 'supergroup' | 'channel' | 'bot';

export interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: 'telegram' | 'whatsapp' | 'v3';
}

export interface SenderData {
  chatId: string;
  chatType: ChatType;
  sender: string;
  chatName: string;
  senderName: string;
  senderType: ChatType;
  senderContactName: string;
  // 0, если номер скрыт или отправитель: группа
  senderPhoneNumber: number;
}

export interface QuotedMessage {
  stanzaId: string;
  participant: string;
}

export interface TextMessageData {
  typeMessage: 'textMessage';
  textMessageData: {
    textMessage: string;
    isForwarded?: boolean;
    forwardingScore?: number;
  };
  // Только если сообщение является цитатой
  quotedMessage?: QuotedMessage;
}

// Остальные типы сообщений пока не типизированы
export interface OtherMessageData {
  typeMessage:
    | 'imageMessage'
    | 'videoMessage'
    | 'documentMessage'
    | 'audioMessage'
    | 'reactionMessage'
    | 'locationMessage'
    | 'contactMessage'
    | 'pollMessage'
    | 'stickerMessage';
  quotedMessage?: QuotedMessage;
  [field: string]: unknown;
}

export type MessageData = TextMessageData | OtherMessageData;

// Входящее, отправленное с телефона и отправленное через API: одинаковый формат
export interface MessageNotification {
  typeWebhook:
    | 'incomingMessageReceived'
    | 'outgoingMessageReceived'
    | 'outgoingAPIMessageReceived';
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

// Страницы для Telegram в документации нет, формат взят из WhatsApp-версии
export type OutgoingMessageStatus =
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'noAccount'
  | 'notInGroup'
  | 'suspended'
  | 'yellowCard';

export interface OutgoingMessageStatusNotification {
  typeWebhook: 'outgoingMessageStatus';
  instanceData: InstanceData;
  timestamp: number;
  chatId: string;
  idMessage: string;
  status: OutgoingMessageStatus;
  // Описание ошибки
  description?: string;
  sendByApi: boolean;
}

// Сервисные уведомления пока не типизированы
export interface OtherNotification {
  typeWebhook: 'stateInstanceChanged';
  instanceData: InstanceData;
  timestamp: number;
  [field: string]: unknown;
}

export type NotificationBody =
  MessageNotification | OutgoingMessageStatusNotification | OtherNotification;

// null, если за receiveTimeout уведомлений не пришло
export type ReceiveNotificationResponse = {
  // Нужен для deleteNotification
  receiptId: number;
  body: NotificationBody;
} | null;

// getChatHistory
export interface GetChatHistoryRequest {
  chatId: string;
  // По умолчанию 100
  count?: number;
}

export type HistoryTypeMessage =
  | 'textMessage'
  | 'imageMessage'
  | 'videoMessage'
  | 'documentMessage'
  | 'audioMessage'
  | 'pollMessage'
  | 'locationMessage';

interface HistoryMessageBase {
  idMessage: string;
  timestamp: number;
  typeMessage: HistoryTypeMessage;
  chatId: string;
  chatType: ChatType;
  isForwarded?: boolean;
  forwardingScore?: number;
  // Если typeMessage = textMessage
  textMessage?: string;
  // Если typeMessage = image/video/document/audioMessage
  downloadUrl?: string;
  caption?: string;
  fileName?: string;
  // Превью в base64
  jpegThumbnail?: string;
  mimeType?: string;
  isAnimated?: boolean;
  // Есть в примере ответа, в таблице полей не описаны
  isEdited?: boolean;
  isDeleted?: boolean;
  editedMessageId?: string;
  deletedMessageId?: string;
}

export interface IncomingHistoryMessage extends HistoryMessageBase {
  type: 'incoming';
  senderName: string;
  senderType: ChatType;
  senderContactName: string;
}

export interface OutgoingHistoryMessage extends HistoryMessageBase {
  type: 'outgoing';
  statusMessage: 'delivered' | 'read';
  sendByApi: boolean;
}

export type HistoryMessage = IncomingHistoryMessage | OutgoingHistoryMessage;

export type GetChatHistoryResponse = HistoryMessage[];

// deleteNotification
export interface DeleteNotificationResponse {
  // false, если уведомление не найдено или уже удалено
  result: boolean;
  reason: string;
}
