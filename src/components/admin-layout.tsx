import { Layout } from 'react-admin';
import { FC, memo, ReactNode, useMemo } from 'react';
import { AdminAppBar } from './admin-app-bar';

interface Props {
  children: ReactNode;
}

export const AdminLayout: FC<Props> = memo(({ children }) => {
  const appBar = useMemo(() => {
    return AdminAppBar;
  }, []);

  return (
    <Layout appBar={appBar}>
      {children}
    </Layout>
  );
});