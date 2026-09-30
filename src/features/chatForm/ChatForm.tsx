import {type KeyboardEvent, useRef} from 'react';
import {useMutation} from '@tanstack/react-query';
import {Button, Form, Input, Popover} from 'antd';
import type {TextAreaRef} from 'antd/es/input/TextArea';
import {Send, Smile} from 'lucide-react';
import {useTranslation} from 'react-i18next';

import {useNotification} from '@/app/providers';
import {selectCurrentChat, useChatStore, useMessageStore} from '@/entities';
import {apiMutation, EmojiPicker} from '@/shared';

import styles from './ChatForm.module.scss';

// Ограничение GREEN-API для sendMessage
const MAX_MESSAGE_LENGTH = 4096;

interface FormValues {
  message: string;
}

export const ChatForm = () => {
  const {t} = useTranslation();
  const [form] = Form.useForm<FormValues>();
  const {openNotification} = useNotification();
  const chat = useChatStore(selectCurrentChat);
  const addMessage = useMessageStore(({addMessage}) => addMessage);
  const textAreaRef = useRef<TextAreaRef>(null);

  const message = Form.useWatch('message', form);
  const canSubmit =
    Boolean(message?.trim()) && message.length <= MAX_MESSAGE_LENGTH;

  const {mutate: sendMessage, isPending} = useMutation(
    apiMutation('sendMessage')
  );

  if (!chat) {
    return null;
  }

  const handleFinish = ({message}: FormValues) => {
    if (isPending) return;

    const text = message.trim();

    sendMessage(
      {chatId: chat.chatId, message: text},
      {
        onSuccess: ({idMessage}) => {
          addMessage({
            idMessage,
            chatId: chat.chatId,
            type: 'outgoing',
            text,
            timestamp: Math.floor(Date.now() / 1000),
            status: 'sent',
          });
          form.resetFields();
        },
        // Текст остаётся в поле, чтобы можно было повторить
        onError: (error) => {
          openNotification('error', t('send-message-error'), error.message);
        },
      }
    );
  };

  // Вставка эмодзи на место курсора (или вместо выделения)
  const insertEmoji = (emoji: string) => {
    const textArea = textAreaRef.current?.resizableTextArea?.textArea;
    const value: string = form.getFieldValue('message') ?? '';
    const start = textArea?.selectionStart ?? value.length;
    const end = textArea?.selectionEnd ?? value.length;
    const caret = start + emoji.length;

    form.setFieldValue(
      'message',
      value.slice(0, start) + emoji + value.slice(end)
    );

    // Курсор после эмодзи, после того как React обновит поле
    requestAnimationFrame(() => {
      textArea?.focus();
      textArea?.setSelectionRange(caret, caret);
    });
  };

  // Enter: отправить, Shift+Enter: перенос строки
  const handlePressEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey || e.nativeEvent.isComposing) return;

    e.preventDefault();
    form.submit();
  };

  return (
    <Form<FormValues>
      // Черновик сбрасывается при смене чата
      key={chat.chatId}
      form={form}
      className={styles.form}
      onFinish={handleFinish}
    >
      <Popover
        trigger='click'
        placement='topLeft'
        arrow={false}
        classNames={{container: styles.emojiPopover}}
        content={<EmojiPicker onSelect={insertEmoji} />}
      >
        <Button
          type='text'
          aria-label={t('insert-emoji')}
          icon={<Smile size={18} />}
        />
      </Popover>
      <Form.Item
        name='message'
        className={styles.field}
        rules={[
          {
            required: true,
            whitespace: true,
            message: t('message-required'),
            // Только при отправке, чтобы не ругаться на пустое поле при вводе
            validateTrigger: 'onSubmit',
          },
          {
            max: MAX_MESSAGE_LENGTH,
            message: t('message-too-long', {max: MAX_MESSAGE_LENGTH}),
          },
        ]}
      >
        <Input.TextArea
          ref={textAreaRef}
          autoFocus
          autoSize={{minRows: 1, maxRows: 6}}
          placeholder={t('message-placeholder')}
          // Счётчик появляется ближе к лимиту
          count={{
            max: MAX_MESSAGE_LENGTH,
            show: ({count}) =>
              count > MAX_MESSAGE_LENGTH * 0.9
                ? `${count} / ${MAX_MESSAGE_LENGTH}`
                : null,
          }}
          onPressEnter={handlePressEnter}
        />
      </Form.Item>
      <Button
        type='primary'
        htmlType='submit'
        aria-label={t('send')}
        icon={<Send size={16} />}
        disabled={!canSubmit}
        loading={isPending}
      />
    </Form>
  );
};
