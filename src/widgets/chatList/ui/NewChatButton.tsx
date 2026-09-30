import {Button, Tooltip} from 'antd';
import {Plus} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {CreateChatModal} from '@/features/createChat';
import {useDisclosure} from '@/shared';

interface NewChatButtonProps {
  className?: string;
}

// Кнопка "+" вместе со своей модалкой создания чата
export const NewChatButton = ({className}: NewChatButtonProps) => {
  const {t} = useTranslation();
  const [opened, {open, close}] = useDisclosure();

  return (
    <>
      <Tooltip title={t('new-chat')}>
        <Button
          className={className}
          icon={<Plus size={16} />}
          aria-label={t('new-chat')}
          onClick={open}
        />
      </Tooltip>
      <CreateChatModal open={opened} onClose={close} />
    </>
  );
};
