import { Close, Done } from "@mui/icons-material";
import { FC, memo, useCallback, useMemo } from "react";

import { Button, Edit, SaveButton, SimpleForm, TextInput, Toolbar, useRedirect, DateInput } from "react-admin";

const EditToolbar: FC = memo(() => {
  const redirect = useRedirect();
  
  const onClickCancel = useMemo(() => () => {
    redirect('/user-profiles');
  }, [redirect]);

  return (
    <Toolbar sx={{
      '&.MuiToolbar-root': {
        display: 'flex',
        justifyContent: 'start',
        paddingX: 2,
        background: 'transparent',
      }
    }}>
      <SaveButton size="small" icon={<Done />} sx={{
        padding: 1,
        borderRadius: 18,
        paddingX: 2,
      }} />
      <Button
        variant="outlined"
        size="small"
        startIcon={<Close />}
        label="Cancel"
        sx={{
          marginLeft: 1,
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
        }}
        onClick={onClickCancel}
      />
    </Toolbar>
  );
});

export const AdminUserProfileEdit: FC = memo(() => {
  const redirect = useRedirect();

  const toolbar = <EditToolbar />;

  const onSuccess = useCallback(() => {
    redirect(`/user-profiles`);
  }, [redirect]);

  const transform = useCallback((data: any) => {
    delete data.createdAt
    delete data.updatedAt;
    return data;
  }, []);

  return (
    <Edit mutationMode="pessimistic" mutationOptions={{ onSuccess }} transform={transform} sx={{
      '& .RaEdit-main': {
        marginTop: 1,
      }
    }}>
      <SimpleForm toolbar={toolbar} sx={{
        paddingBottom: 0,
      }}>
        <TextInput disabled size="small" source="id" />
        <TextInput size="small" source="firstName" />
        <TextInput size="small" source="lastName" />
        <TextInput size="small" source="citizenshipCountry" />
        <TextInput size="small" source="residenceCountry" />

        <DateInput size="small" source="dateOfBirth" />
      </SimpleForm>
    </Edit>
  );
});