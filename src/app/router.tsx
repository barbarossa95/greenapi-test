import {Button, Result} from 'antd';
import {useTranslation} from 'react-i18next';
import {Link, Route, Routes as ReactRoutes} from 'react-router';

import {MainPage} from '@/pages';
import {Routes} from '@/shared';

export const Router = () => {
  const {t} = useTranslation();

  return (
    <ReactRoutes>
      {/* Главная страница */}
      <Route id='root' path={Routes.MAIN}>
        <Route index element={<MainPage />} />
      </Route>
      <Route
        path='*'
        element={
          <Result
            status='404'
            title='404'
            subTitle={t('404')}
            extra={
              <Link to='/'>
                <Button type='primary'>{t('back-home')}</Button>
              </Link>
            }
          />
        }
      />
    </ReactRoutes>
  );
};
