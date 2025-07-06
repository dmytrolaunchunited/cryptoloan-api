import { Admin, Resource, AuthProvider, fetchUtils, useNotify } from "react-admin";
import { memo, useMemo } from "react";
import { createTheme } from "@mui/material";
import { Description } from '@mui/icons-material';
import simpleRestProvider from "ra-data-simple-rest";
import dynamic from "next/dynamic";
import { AdminLoginPage } from "../components/admin-login-page";
import { usePalette } from "../hooks/palette";
import { AdminLayout } from "../components/admin-layout";
import { AdminDashboard } from "../components/admin-dashboard";
import { AdminCatchAll } from "../components/admin-catch-all";
import { AdminScoringConditionList } from "../components/admin-scoring-condition-list";
import { AdminScoringConditionCreate } from "../components/admin-scoring-condition-create";
import { AdminScoringConditionEdit } from "../components/admin-scoring-condition-edit";
import { AdminScoringFeatureList } from "../components/admin-scoring-feature-list";
import { AdminScoringFeatureCreate } from "../components/admin-scoring-feature-create";
import { AdminScoringFeatureEdit } from "../components/admin-scoring-feature-edit";
import { AdminUserEdit } from "../components/admin-user-edit";
import { AdminUserList } from "../components/admin-user-list";
import { AdminScoringQuestionCreate } from "../components/admin-scoring-question-create";
import { AdminScoringQuestionList } from "../components/admin-scoring-question-list";
import { AdminScoringQuestionEdit } from "../components/admin-scoring-question-edit";
import { AdminApplicationList } from "../components/admin-application-list";
import { AdminApplicationEdit } from "../components/admin-application-edit";
import { AdminApplicationCreate } from "../components/admin-application-create";
import { AdminUserProfileEdit } from "../components/admin-user-profile-edit";
import { AdminUserProfileList } from "../components/admin-user-profile-list";
import { AdminUserDeviceList } from "../components/admin-user-device-list";

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

  const dashboard = useMemo(() => {
    return AdminDashboard;
  }, []);

  const catchAll = useMemo(() => {
    return AdminCatchAll;
  }, []);

  return (
    <Admin theme={theme} catchAll={catchAll} dashboard={dashboard} layout={layout} loginPage={loginPage} dataProvider={dataProvider} authProvider={authProvider}>
      <Resource
        name="applications"
        icon={Description}
        list={AdminApplicationList}
        edit={AdminApplicationEdit}
        create={AdminApplicationCreate}
        recordRepresentation="id"
      />
      <Resource
        name="scoring-conditions"
        icon={Description}
        list={AdminScoringConditionList}
        edit={AdminScoringConditionEdit}
        create={AdminScoringConditionCreate}
        options={{
          label: "Scoring Conditions"
        }}
        recordRepresentation="id"
      />
       <Resource
        name="scoring-features"
        icon={Description}
        list={AdminScoringFeatureList}
        edit={AdminScoringFeatureEdit}
        create={AdminScoringFeatureCreate}
        options={{
          label: "Scoring Features"
        }}
        recordRepresentation="id"
      />
      <Resource
        name="scoring-questions"
        icon={Description}
        list={AdminScoringQuestionList}
        edit={AdminScoringQuestionEdit}
        create={AdminScoringQuestionCreate}
        options={{
          label: "Scoring Questions"
        }}
        recordRepresentation="id"
      />
      <Resource
        name="users"
        icon={Description}
        list={AdminUserList}
        edit={AdminUserEdit}
        recordRepresentation="id"
      />
      <Resource
        name="user-profiles"
        icon={Description}
        list={AdminUserProfileList}
        edit={AdminUserProfileEdit}
        options={{
          label: "User Profiles"
        }}
        recordRepresentation="id"
      />
      <Resource
        name="user-devices"
        icon={Description}
        list={AdminUserDeviceList}
        options={{
          label: "User Devices"
        }}
        recordRepresentation="id"
      />
    </Admin>
  );
});

const ssr = false;
export default dynamic(() => Promise.resolve(App), { ssr });