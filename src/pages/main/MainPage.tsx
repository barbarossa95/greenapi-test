import {Layout} from 'antd';

import {ChatFeed} from '@/features/chatFeed';
import {ChatForm} from '@/features/chatForm';
import {useNotificationPolling} from '@/features/notificationPolling';
import {ChatHeader, ChatSider} from '@/widgets';

import styles from './MainPage.module.scss';

const {Header, Footer, Content} = Layout;

export const MainPage = () => {
  useNotificationPolling();

  return (
    <Layout className={styles.layout}>
      <ChatSider />
      <Layout>
        <Header className={styles.header}>
          <ChatHeader />
        </Header>
        <Content className={styles.content}>
          <ChatFeed />
        </Content>

        <Footer className={styles.footer}>
          <ChatForm />
        </Footer>
      </Layout>
    </Layout>
  );
};
