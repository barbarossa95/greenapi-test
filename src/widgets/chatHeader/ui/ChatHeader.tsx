import {Typography} from 'antd';

import {
  ChatAvatar,
  getChatSubtitle,
  getChatTitle,
  selectCurrentChat,
  useChatStore,
} from '@/entities';

import styles from './ChatHeader.module.scss';

export const ChatHeader = () => {
  const chat = useChatStore(selectCurrentChat);

  if (!chat) {
    return null;
  }

  const title = getChatTitle(chat);
  const subtitle = getChatSubtitle(chat);

  return (
    <div className={styles.header}>
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
    </div>
  );
};
