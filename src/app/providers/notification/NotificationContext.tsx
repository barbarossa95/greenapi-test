import {createContext, ReactNode} from 'react';

interface INotificationContextType {
  openNotification: (
    type: 'success' | 'info' | 'warning' | 'error',
    message: string,
    description?: string,
    icon?: ReactNode
  ) => void;
}

export const NotificationContext = createContext<
  INotificationContextType | undefined
>(undefined);
