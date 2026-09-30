import type {Method} from 'axios';

import type {
  CheckAccountRequest,
  CheckAccountResponse,
  DeleteNotificationResponse,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
  ReceiveNotificationRequest,
  ReceiveNotificationResponse,
  SendMessageRequest,
  SendMessageResponse,
} from './types';

// Фантомный ключ: хранит типы эндпоинта, в рантайме отсутствует
declare const phantom: unique symbol;

export interface EndpointDef<
  TData,
  TResponse,
  TPath extends readonly unknown[] = [],
> {
  method: Method;
  [phantom]?: {data: TData; response: TResponse; path: TPath};
}

const def = <TData, TResponse, TPath extends readonly unknown[] = []>(
  method: Method
) => ({method}) as EndpointDef<TData, TResponse, TPath>;

// Методы GREEN-API для чтения (queries)
export const queryEndpoints = {
  // История сообщений чата (POST, но без побочных эффектов)
  getChatHistory: def<GetChatHistoryRequest, GetChatHistoryResponse>('POST'),
  // Long polling: ждёт уведомление до receiveTimeout секунд
  receiveNotification: def<
    ReceiveNotificationRequest,
    ReceiveNotificationResponse
  >('GET'),
} as const;

// Методы GREEN-API для изменения (mutations)
export const mutationEndpoints = {
  // Проверка наличия аккаунта Telegram: вызывается по сабмиту формы
  checkAccount: def<CheckAccountRequest, CheckAccountResponse>('POST'),
  sendMessage: def<SendMessageRequest, SendMessageResponse>('POST'),
  // receiptId из receiveNotification передаётся в пути
  deleteNotification: def<
    void,
    DeleteNotificationResponse,
    [receiptId: number]
  >('DELETE'),
} as const;

export const endpoints = {...queryEndpoints, ...mutationEndpoints};

export type QueryEndpoint = keyof typeof queryEndpoints;
export type MutationEndpoint = keyof typeof mutationEndpoints;
export type Endpoint = keyof typeof endpoints;

type Meta<E extends Endpoint> = NonNullable<
  (typeof endpoints)[E][typeof phantom]
>;

export type DataOf<E extends Endpoint> = Meta<E>['data'];
export type ResponseOf<E extends Endpoint> = Meta<E>['response'];
export type PathOf<E extends Endpoint> = Meta<E>['path'];

// Ключи: [endpoint, data, ...path] для запросов, [endpoint, ...path] для мутаций
export type ApiQueryKey<E extends QueryEndpoint = QueryEndpoint> = readonly [
  E,
  DataOf<E>,
  ...PathOf<E>,
];
export type ApiMutationKey<E extends MutationEndpoint = MutationEndpoint> =
  readonly [E, ...PathOf<E>];
