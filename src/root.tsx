import {Links, Meta, Outlet, Scripts, ScrollRestoration} from 'react-router';

// eslint-disable-next-line react-refresh/only-export-components
export * from '@/app/config/meta';
// eslint-disable-next-line react-refresh/only-export-components
export * from '@/app/config/links';

export const Layout = ({children}: {children: React.ReactNode}) => (
  <html lang='en'>
    <head>
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
);

const Root = () => {
  return <Outlet />;
};

export default Root;
