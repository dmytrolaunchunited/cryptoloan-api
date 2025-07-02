import { Close, Done } from "@mui/icons-material";
import { FC, memo, useMemo } from "react";
import { Button, Create, required, SaveButton, SimpleForm, TextInput, Toolbar, useRedirect } from "react-admin";

const CreateToolbar: FC = memo(() => {
  const redirect = useRedirect();
  
  const onClickCancel = useMemo(() => () => {
    redirect('/applications');
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

export const AdminApplicationCreate: FC = memo(() => {
  const toolbar = <CreateToolbar />;

  return (
    <Create sx={{
      '& .RaCreate-main': {
        marginTop: 1,
      }
    }}>
      <SimpleForm toolbar={toolbar} sx={{
        paddingBottom: 0,
      }}>
        <TextInput size="small" source="name" fullWidth validate={required()} />
        <TextInput size="small" source="uuid" fullWidth validate={required()} />
      </SimpleForm>
    </Create>
  );
});