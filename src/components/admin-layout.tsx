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
    <Layout appBar={appBar} sx={{
      '& .RaSidebar-fixed': {
        display: "flex"
      },
      '& .RaSidebar-fixed .MuiList-root': {
        "--Paper-shadow": "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        "--Paper-overlay": "linear-gradient(rgba(255, 255, 255, 0.051), rgba(255, 255, 255, 0.051))",
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: "4px",
        boxShadow: "var(--Paper-shadow)",
        backgroundImage: "var(--Paper-overlay)",
        marginTop: "8px",
        marginLeft: "8px",
        marginBottom: "8px",
        flex: 1,
      },
      '& .MuiMenuItem-root': {
        opacity: 0.5
      },
      '& .RaMenuItemLink-active': {
        opacity: 1,
      },
      '& .MuiFormControl-root, & .MuiAutocomplete-root': {
        width: '100%',
      },
    }}>
      {children}
    </Layout>
  );
});