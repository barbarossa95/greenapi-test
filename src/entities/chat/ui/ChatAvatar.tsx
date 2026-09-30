import {Avatar, type AvatarProps} from 'antd';
import {User} from 'lucide-react';

import {getChatInitial} from '../lib';
import type {Chat} from '../model';

interface ChatAvatarProps extends Omit<AvatarProps, 'icon' | 'children'> {
  chat: Chat;
}

// Первая буква username, иначе иконка пользователя
export const ChatAvatar = ({
  chat,
  size = 'large',
  ...props
}: ChatAvatarProps) => {
  const initial = getChatInitial(chat);

  return (
    <Avatar
      size={size}
      icon={initial ? undefined : <User size={20} />}
      {...props}
    >
      {initial}
    </Avatar>
  );
};
