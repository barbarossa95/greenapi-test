import {type FC, type PropsWithChildren} from 'react';
import {ConfigProvider, message} from 'antd';
import en_US from 'antd/locale/en_US';

message.config({
  top: 24,
  duration: 3,
  maxCount: 3,
  getContainer: () => document.body,
});

export const ThemeProvider: FC<PropsWithChildren> = ({children}) => {
  return <ConfigProvider locale={en_US}>{children}</ConfigProvider>;
};
