import {Tooltip, Typography} from 'antd';
import clsx from 'clsx';

import {type Chat, ChatAvatar, getChatSubtitle, getChatTitle} from '@/entities';

import styles from './ChatList.module.scss';

interface ChatListItemProps {
  chat: Chat;
  active?: boolean;
  // Только аватар, название в подсказке
  collapsed?: boolean;
  onClick: () => void;
}

export const ChatListItem = ({
  chat,
  active,
  collapsed,
  onClick,
}: ChatListItemProps) => {
  const title = getChatTitle(chat);
  const subtitle = getChatSubtitle(chat);

  const className = clsx(styles.item, active && styles.active);

  return (
    <Tooltip title={collapsed ? title : undefined} placement='right'>
      <button
        type='button'
        className={className}
        aria-current={active || undefined}
        aria-label={collapsed ? title : undefined}
        onClick={onClick}
      >
        <ChatAvatar chat={chat} />
        {!collapsed && (
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
        )}
      </button>
    </Tooltip>
  );
};
