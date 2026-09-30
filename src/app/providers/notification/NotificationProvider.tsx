import {FC, PropsWithChildren, ReactNode} from 'react';
import {notification} from 'antd';

import {DEFAULT_ICONS} from './constants';
import {NotificationContext} from './NotificationContext';

export const NotificationProvider: FC<PropsWithChildren> = ({children}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    description?: string,
    icon?: ReactNode
  ) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 3,
      closeIcon: false,
      showProgress: true,
      icon: icon || DEFAULT_ICONS[type],
    });
  };

  return (
    <NotificationContext.Provider value={{openNotification}}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};
