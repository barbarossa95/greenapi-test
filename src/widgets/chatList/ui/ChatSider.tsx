import {useMemo, useState} from 'react';
import {Button} from 'antd';
import {Menu} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {useChatStore} from '@/entities';
import {filterChats} from '../lib';

import {ChatList} from './ChatList';
import {NewChatButton} from './NewChatButton';
import {SearchField} from './SearchField';

import styles from './ChatSider.module.scss';

interface ChatSiderProps {
  onToggleSider: () => void;
}
// Боковая панель: данные из стора и поиск здесь, ChatList только отображает
export const ChatSider = ({onToggleSider}: ChatSiderProps) => {
  const {t} = useTranslation();
  const chatsMap = useChatStore(({chats}) => chats);
  const currentChatId = useChatStore(({currentChatId}) => currentChatId);
  const setCurrentChat = useChatStore(({setCurrentChat}) => setCurrentChat);
  const [query, setQuery] = useState('');

  const chats = useMemo(() => Array.from(chatsMap.values()), [chatsMap]);
  const filteredChats = useMemo(
    () => filterChats(chats, query),
    [chats, query]
  );

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <NewChatButton />
        <SearchField value={query} onChange={setQuery} />
        <Button
          icon={<Menu size={16} />}
          aria-label={t('toggle-chats')}
          onClick={onToggleSider}
        />
      </div>
      <ChatList
        chats={filteredChats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChat}
        emptyText={t(chats.length ? 'no-chats-found' : 'no-chats')}
      />
    </div>
  );
};
