import {Layout} from 'antd';

import {ChatFeed} from '@/features/chatFeed';
import {ChatForm} from '@/features/chatForm';
import {useNotificationPolling} from '@/features/notificationPolling';
import {useDisclosure} from '@/shared';
import {ChatHeader, ChatSider} from '@/widgets';

import styles from './MainPage.module.scss';

const {Header, Footer, Sider, Content} = Layout;

export const MainPage = () => {
  useNotificationPolling();
  const [collapsed, {toggle}] = useDisclosure();

  return (
    <Layout className={styles.layout}>
      <Sider
        width='25%'
        className={styles.sider}
        collapsed={collapsed}
        collapsible
        trigger={null}
      >
        <ChatSider onToggleSider={toggle} />
      </Sider>
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
