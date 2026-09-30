import {Form, Input, Modal} from 'antd';
import {useTranslation} from 'react-i18next';

import {type InstanceCredentials, useInstanceStore} from '@/entities';

type FormValues = Pick<
  InstanceCredentials,
  'idInstance' | 'apiUrl' | 'apiTokenInstance'
>;

interface SelectInstanceModalProps {
  open: boolean;
  onClose: () => void;
}

export const SelectInstanceModal = ({
  open,
  onClose,
}: SelectInstanceModalProps) => {
  const {t} = useTranslation();
  const [form] = Form.useForm<FormValues>();

  const idInstance = useInstanceStore((s) => s.idInstance);
  const apiUrl = useInstanceStore((s) => s.apiUrl);
  const apiTokenInstance = useInstanceStore((s) => s.apiTokenInstance);
  const setInstance = useInstanceStore((s) => s.setInstance);

  const handleFinish = (values: FormValues) => {
    setInstance({...values, apiUrl: values.apiUrl.trim()});
    onClose();
  };

  const requiredRule = {required: true, message: t('field-required')};

  return (
    <Modal
      title={t('instance-settings')}
      open={open}
      onOk={form.submit}
      onCancel={onClose}
      okText={t('connect')}
      destroyOnHidden
    >
      <Form<FormValues>
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{idInstance, apiUrl, apiTokenInstance}}
      >
        <Form.Item
          name='idInstance'
          label={t('id-instance')}
          rules={[requiredRule]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='apiUrl'
          label={t('api-url')}
          rules={[requiredRule, {type: 'url', message: t('invalid-url')}]}
        >
          <Input placeholder='https://api.green-api.com' />
        </Form.Item>
        <Form.Item
          name='apiTokenInstance'
          label={t('api-token-instance')}
          rules={[requiredRule]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
