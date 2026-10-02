import {useEffect} from 'react';
import {Bubble, type BubbleItemType, type BubbleListProps} from '@ant-design/x';
import {useQuery} from '@tanstack/react-query';
import {Button, Empty, Result, Spin, Typography} from 'antd';
import {Check, CheckCheck, CircleAlert} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {
  fromHistoryMessage,
  getMessageTypeKey,
  mergeMessages,
  type Message,
  selectChatMessages,
  selectCurrentChat,
  selectHasChatMessages,
  selectIsInstanceSet,
  useChatStore,
  useInstanceStore,
  useMessageStore,
} from '@/entities';
import {CreateChatModal} from '@/features/createChat';
import {apiQuery, formatUnixTime, useDisclosure} from '@/shared';
import {SelectInstanceButton} from '../selectInstance/SelectInstanceButton';

import styles from './ChatFeed.module.scss';

const StatusIcon = ({status}: Pick<Message, 'status'>) => {
  switch (status) {
    case 'sent':
      return <Check size={14} />;
    case 'delivered':
      return <CheckCheck size={14} />;
    case 'read':
      return <CheckCheck size={14} className={styles.read} />;
    case 'failed':
      return <CircleAlert size={14} className={styles.failed} />;
    default:
      return null;
  }
};

const MessageFooter = ({timestamp, status}: Message) => (
  <span className={styles.footer}>
    {formatUnixTime(timestamp)}
    <StatusIcon status={status} />
  </span>
);

// Сколько сообщений загружать из истории (по умолчанию в API тоже 100)
const HISTORY_COUNT = 100;

// Роль bubble = Message['type']
const roles: BubbleListProps['role'] = {
  outgoing: {placement: 'end', variant: 'filled', shape: 'corner'},
  incoming: {placement: 'start', variant: 'outlined', shape: 'corner'},
};

export const ChatFeed = () => {
  const {t} = useTranslation();
  const chat = useChatStore(selectCurrentChat);
  const chatId = chat?.chatId;
  const messages = useMessageStore(selectChatMessages(chatId));
  const hasMessages = useMessageStore(selectHasChatMessages(chatId));
  const setChatMessages = useMessageStore((s) => s.setChatMessages);
  const [opened, {open, close}] = useDisclosure();

  // История грузится, только если сообщений чата ещё нет в сторе
  const history = useQuery({
    ...apiQuery('getChatHistory', {chatId: chatId ?? '', count: HISTORY_COUNT}),
    enabled: Boolean(chatId) && !hasMessages,
  });

  useEffect(() => {
    if (!chatId || !history.data) return;

    // Пока шла загрузка, в чат могли прийти сообщения из уведомлений
    const current = selectChatMessages(chatId)(useMessageStore.getState());

    setChatMessages(
      chatId,
      mergeMessages(history.data.map(fromHistoryMessage), current)
    );
  }, [chatId, history.data, setChatMessages]);

  const isInstanceSet = useInstanceStore(selectIsInstanceSet);

  if (!isInstanceSet) {
    return (
      <>
        <Result
          status='info'
          title={t('no-instance-selected')}
          subTitle={t('provide-instance-data-to-use-application')}
          extra={<SelectInstanceButton />}
        />
        <CreateChatModal open={opened} onClose={close} />
      </>
    );
  }

  if (!chat) {
    return (
      <>
        <Result
          status='info'
          title={t('no-chat-selected')}
          subTitle={t('start-chat-hint')}
          extra={
            <Button type='primary' onClick={open}>
              {t('start-chat')}
            </Button>
          }
        />
        <CreateChatModal open={opened} onClose={close} />
      </>
    );
  }

  const items: BubbleItemType[] = messages.map((message) => ({
    key: message.idMessage,
    role: 'user',
    content: message.text || (
      <Typography.Text type='secondary' italic>
        {t('unsupported-message', {
          type: t(getMessageTypeKey(message.typeMessage)),
        })}
      </Typography.Text>
    ),
    footer: <MessageFooter {...message} />,
    footerPlacement: message.type === 'outgoing' ? 'outer-end' : 'outer-start',
  }));

  const renderEmpty = () => {
    if (history.isLoading) {
      return <Spin className={styles.empty} />;
    }

    if (history.isError) {
      return (
        <Empty
          className={styles.empty}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('history-load-error')}
        >
          <Button onClick={() => void history.refetch()}>{t('retry')}</Button>
        </Empty>
      );
    }

    return (
      <Empty
        className={styles.empty}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('no-messages')}
      />
    );
  };

  return (
    <div className={styles.feed}>
      {items.length ? (
        <Bubble.List
          key={chat.chatId}
          className={styles.list}
          items={items}
          role={roles}
          autoScroll
        />
      ) : (
        renderEmpty()
      )}
    </div>
  );
};
