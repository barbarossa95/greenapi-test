import '@ant-design/v5-patch-for-react-19';
import '@/shared/lib/i18n';
import './global.scss';

import {NuqsAdapter} from 'nuqs/adapters/react-router/v8';

import {
  NotificationProvider,
  TanstackQueryProvider,
  ThemeProvider,
} from './providers';
import {Router} from './router';

const App = () => {
  return (
    <NuqsAdapter>
      <ThemeProvider>
        <TanstackQueryProvider>
          <NotificationProvider>
            <Router />
          </NotificationProvider>
        </TanstackQueryProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
};

export default App;
