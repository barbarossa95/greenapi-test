import {useMutation} from '@tanstack/react-query';
import {Form, type FormRule, Modal} from 'antd';
import PhoneInput, {type PhoneNumber} from 'antd-phone-input';
import {useTranslation} from 'react-i18next';

import {useNotification} from '@/app/providers';
import {useChatStore} from '@/entities';
import {apiMutation} from '@/shared';

interface FormValues {
  phone: PhoneNumber;
}

interface CreateChatModalProps {
  open: boolean;
  onClose: () => void;
}

// Номер в международном формате без разделителей: 79876543210
const toPhoneNumber = ({countryCode, areaCode, phoneNumber}: PhoneNumber) =>
  Number(`${countryCode ?? ''}${areaCode ?? ''}${phoneNumber ?? ''}`);

export const CreateChatModal = ({open, onClose}: CreateChatModalProps) => {
  const {t} = useTranslation();
  const [form] = Form.useForm<FormValues>();
  const {openNotification} = useNotification();

  const addChat = useChatStore((s) => s.addChat);
  const setCurrentChat = useChatStore((s) => s.setCurrentChat);

  const {mutate: checkAccount, isPending} = useMutation(
    apiMutation('checkAccount')
  );

  const handleFinish = ({phone}: FormValues) => {
    const phoneNumber = toPhoneNumber(phone);

    checkAccount(
      {phoneNumber},
      {
        onSuccess: (account) => {
          if (!account.exist) {
            openNotification('error', t('account-not-found'));
            return;
          }

          addChat({
            chatId: account.chatId,
            username: account.username,
            phoneNumber: account.phoneNumber ?? phoneNumber,
          });
          setCurrentChat(account.chatId);
          onClose();
        },
        onError: (error) => {
          openNotification('error', t('check-account-error'), error.message);
        },
      }
    );
  };

  const phoneRule: FormRule = {
    validator: (_, value?: PhoneNumber) => {
      if (!value?.phoneNumber) {
        return Promise.reject(new Error(t('field-required')));
      }
      // valid(true): строгая проверка по длине номера для страны
      if (value.valid?.()) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(t('invalid-phone')));
    },
  };

  return (
    <Modal
      title={t('new-chat')}
      open={open}
      onOk={form.submit}
      onCancel={() => onClose()}
      okText={t('start-chat')}
      confirmLoading={isPending}
      destroyOnHidden
    >
      <Form<FormValues> form={form} layout='vertical' onFinish={handleFinish}>
        <Form.Item name='phone' label={t('phone')} rules={[phoneRule]}>
          <PhoneInput enableSearch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
