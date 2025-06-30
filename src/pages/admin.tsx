import { Admin, Resource, AuthProvider, fetchUtils, useNotify } from "react-admin";
import { memo, useMemo } from "react";
import { createTheme } from "@mui/material";
import { Description } from '@mui/icons-material';
import simpleRestProvider from "ra-data-simple-rest";
import dynamic from "next/dynamic";
import { AdminLoginPage } from "../components/admin-login-page";
import { usePalette } from "../hooks/palette";
import { AdminApplicationList } from "../components/admin-application-list";
import { AdminApplicationEdit } from "../components/admin-application-edit";
import { AdminApplicationCreate } from "../components/admin-application-create";

import { AdminConditionList } from "../components/admin-condition-list";
import { AdminLayout } from "../components/admin-layout";

interface CheckError {
  status: number;
}

const App = memo(() => {
  const palette = usePalette();
  const notify = useNotify();
  const theme = createTheme({ palette });
  
  const dataProvider = useMemo(() => {
    return simpleRestProvider('/api/admin', (url: string, options = {}) => {
      const headers = new Headers(options.headers || { Accept: 'application/json'});
      const secretKey = localStorage.getItem('secretKey');

      headers.set('X-Secret-Key', secretKey || '');

      options.headers = headers;
      return fetchUtils.fetchJson(url, options);
    });
  }, []);

  const authProvider = useMemo(() => {
    return {
      logout: async () => {
        localStorage.removeItem('secretKey');
      },
      checkAuth: async () => {
        if (!localStorage.getItem('secretKey')) {
          throw new Error("You're not authenticated. Please log in to access this page.");
        }
      },
      checkError: async (params: CheckError) => {
        if ([401, 403].includes(params.status)) {
          localStorage.removeItem('secretKey');
          throw new Error('Your session has expired. Please log in again to continue.');
        }
      },
      getIdentity: async () => {
        // const username = localStorage.getItem('username');
        return null //{ id: 'test', fullName: 'test' };
      },
    } as unknown as AuthProvider;
  }, [notify]);

  const loginPage = useMemo(() => {
    return AdminLoginPage;
  }, []);

  const layout = useMemo(() => {
    return AdminLayout;
  }, []);

  return (
    <Admin theme={theme} layout={layout} loginPage={loginPage} dataProvider={dataProvider} authProvider={authProvider}>
      <Resource
        name="applications"
        icon={Description}
        list={AdminApplicationList}
        edit={AdminApplicationEdit}
        create={AdminApplicationCreate}
        recordRepresentation="id"
      />
      <Resource
        name="conditions"
        icon={Description}
        list={AdminConditionList}
        recordRepresentation="id"
      />
    </Admin>
  );
});

const ssr = false;
export default dynamic(() => Promise.resolve(App), { ssr });