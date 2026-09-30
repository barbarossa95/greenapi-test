import {Empty} from 'antd';
import type {ReactNode} from 'react';

import type {Chat} from '@/entities';

import {ChatListItem} from './ChatListItem';

import styles from './ChatList.module.scss';

interface ChatListProps {
  chats: Chat[];
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
  // Текст для пустого списка: зависит от того, идёт ли поиск
  emptyText?: ReactNode;
}

export const ChatList = ({
  chats,
  currentChatId,
  onSelectChat,
  emptyText,
}: ChatListProps) => (
  <div className={styles.list}>
    {chats.length ? (
      chats.map((chat) => (
        <ChatListItem
          key={chat.chatId}
          chat={chat}
          active={chat.chatId === currentChatId}
          onClick={() => onSelectChat(chat.chatId)}
        />
      ))
    ) : (
      <Empty
        className={styles.empty}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={emptyText}
      />
    )}
  </div>
);
