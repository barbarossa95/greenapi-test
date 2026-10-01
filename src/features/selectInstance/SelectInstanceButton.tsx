import {Button, ButtonProps} from 'antd';
import {KeyRound} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {useDisclosure} from '@/shared';

import {SelectInstanceModal} from './SelectInstanceModal';

export const SelectInstanceButton = ({...props}: ButtonProps) => {
  const {t} = useTranslation();
  const [opened, {open, close}] = useDisclosure();

  return (
    <>
      <Button
        aria-label={t('new-instance')}
        onClick={open}
        icon={<KeyRound size={16} />}
        {...props}
      />
      <SelectInstanceModal open={opened} onClose={close} />
    </>
  );
};
