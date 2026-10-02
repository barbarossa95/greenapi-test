import {useEffect, useMemo, useState} from 'react';
import {Button, Layout} from 'antd';
import clsx from 'clsx';
import {Menu} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {useChatStore} from '@/entities';
import {useDisclosure} from '@/shared';
import {filterChats} from '../lib';

import {ChatList} from './ChatList';
import {NewChatButton} from './NewChatButton';
import {SearchField} from './SearchField';

import styles from './ChatSider.module.scss';

const {Sider} = Layout;

// Ширина свёрнутой панели: аватар 40px + отступы пункта списка.
// На мобильных панель всегда занимает в потоке только эту ширину
const SIDER_COLLAPSED_WIDTH = 72;

export const ChatSider = () => {
  const {t} = useTranslation();

  const [collapsed, {open: collapse, close: expand, toggle}] = useDisclosure();
  const [isMobile, setIsMobile] = useState(false);
  const [query, setQuery] = useState('');

  const overlayOpened = isMobile && !collapsed;

  const chatsMap = useChatStore(({chats}) => chats);
  const currentChatId = useChatStore(({currentChatId}) => currentChatId);
  const setCurrentChat = useChatStore(({setCurrentChat}) => setCurrentChat);

  const chats = useMemo(() => Array.from(chatsMap.values()), [chatsMap]);
  const filteredChats = useMemo(
    () => filterChats(chats, query),
    [chats, query]
  );

  // На узком экране панель по умолчанию свёрнута, а развёрнутая лежит поверх чата
  const handleBreakpoint = (broken: boolean) => {
    setIsMobile(broken);
    if (broken) {
      collapse();
    } else {
      expand();
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChat(chatId);

    if (isMobile) {
      collapse();
    }
  };

  // Esc закрывает развёрнутую поверх чата панель
  useEffect(() => {
    if (!overlayOpened) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') collapse();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [overlayOpened, collapse]);

  return (
    <>
      <Sider
        classNames={{
          root: styles.root,
          body: clsx(
            styles.body,
            collapsed && styles.collapsed,
            overlayOpened && styles.overlay
          ),
        }}
        width={isMobile ? SIDER_COLLAPSED_WIDTH : '25%'}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        breakpoint='md'
        onBreakpoint={handleBreakpoint}
        collapsed={collapsed}
        collapsible
        trigger={null}
      >
        <div className={styles.toolbar}>
          {/* Ряд всегда в DOM, чтобы CSS мог анимировать сворачивание */}
          <div className={styles.contacts}>
            <NewChatButton className={styles.iconButton} />
            <SearchField value={query} onChange={setQuery} />
          </div>
          <Button
            className={styles.iconButton}
            icon={<Menu size={16} />}
            aria-label={t('toggle-chats')}
            aria-expanded={!collapsed}
            onClick={toggle}
          />
        </div>
        <ChatList
          // Поле поиска скрыто, поэтому в свёрнутом виде фильтр не применяем
          chats={collapsed ? chats : filteredChats}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          collapsed={collapsed}
          emptyText={t(chats.length ? 'no-chats-found' : 'no-chats')}
        />
      </Sider>
      {overlayOpened && (
        <div className={styles.backdrop} aria-hidden onClick={collapse} />
      )}
    </>
  );
};
