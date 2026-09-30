import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {createSuperjsonStorage} from '@/shared';

export interface Chat {
  chatId: string;
  username?: string;
  // Имя чата из уведомлений (chatName)
  name?: string;
  phoneNumber?: number;
}

export interface Chats {
  currentChatId: string | undefined;
  chats: Map<string, Chat>;
}

interface ChatState extends Chats {
  setCurrentChat: (chatId: string) => void;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  resetChats: () => void;
}

const initialState: Chats = {
  currentChatId: undefined,
  chats: new Map<string, Chat>(),
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentChat: (chatId) => set({currentChatId: chatId}),
      addChat: (chat: Chat) =>
        set((state) => ({
          chats: new Map(state.chats).set(chat.chatId, chat),
        })),
      deleteChat: (chatId) =>
        set((state) => {
          const next = new Map(state.chats);

          next.delete(chatId);

          return {chats: next};
        }),
      resetChats: () => set(initialState),
    }),
    {
      name: 'green-api-Chat',
      storage: createSuperjsonStorage<ChatState>(),
    }
  )
);

export const selectCurrentChat = (state: ChatState) => {
  if (state.currentChatId && state.chats.has(state.currentChatId)) {
    return state.chats.get(state.currentChatId)!;
  }

  return null;
};
