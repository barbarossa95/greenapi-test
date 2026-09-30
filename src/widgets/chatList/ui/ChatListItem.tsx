import {Typography} from 'antd';

import {type Chat, ChatAvatar, getChatSubtitle, getChatTitle} from '@/entities';

import styles from './ChatList.module.scss';

interface ChatListItemProps {
  chat: Chat;
  active?: boolean;
  onClick: () => void;
}

export const ChatListItem = ({chat, active, onClick}: ChatListItemProps) => {
  const title = getChatTitle(chat);
  const subtitle = getChatSubtitle(chat);

  return (
    <button
      type='button'
      className={active ? `${styles.item} ${styles.active}` : styles.item}
      aria-current={active || undefined}
      onClick={onClick}
    >
      <ChatAvatar chat={chat} />
      <div className={styles.content}>
        <Typography.Text strong ellipsis>
          {title}
        </Typography.Text>
        {subtitle && (
          <Typography.Text ellipsis className={styles.subtitle}>
            {subtitle}
          </Typography.Text>
        )}
      </div>
    </button>
  );
};
