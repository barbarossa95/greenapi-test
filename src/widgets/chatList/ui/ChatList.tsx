import {Empty} from 'antd';
import clsx from 'clsx';
import type {ReactNode} from 'react';

import type {Chat} from '@/entities';

import {ChatListItem} from './ChatListItem';

import styles from './ChatList.module.scss';

interface ChatListProps {
  chats: Chat[];
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
  // Только аватары, без названий
  collapsed?: boolean;
  // Текст для пустого списка: зависит от того, идёт ли поиск
  emptyText?: ReactNode;
}

export const ChatList = ({
  chats,
  currentChatId,
  onSelectChat,
  collapsed,
  emptyText,
}: ChatListProps) => (
  <div className={clsx(styles.list, collapsed && styles.collapsed)}>
    {chats.length
      ? chats.map((chat) => (
          <ChatListItem
            key={chat.chatId}
            chat={chat}
            active={chat.chatId === currentChatId}
            collapsed={collapsed}
            onClick={() => onSelectChat(chat.chatId)}
          />
        ))
      : // В узкой свёрнутой панели текст пустого списка не помещается
        !collapsed && (
          <Empty
            className={styles.empty}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyText}
          />
        )}
  </div>
);
