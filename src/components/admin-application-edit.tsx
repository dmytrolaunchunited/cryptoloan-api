import { Close, Done } from "@mui/icons-material";
import { FC, memo, useMemo } from "react";
import { Button, Edit, required, SaveButton, SimpleForm, TextInput, Toolbar, useRedirect } from "react-admin";

const EditToolbar: FC = memo(() => {
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

export const AdminApplicationEdit: FC = memo(() => {
  const toolbar = <EditToolbar />;

  return (
    <Edit>
      <SimpleForm toolbar={toolbar} sx={{
        paddingBottom: 0,
      }}>
          <TextInput disabled label="Id" source="id" />
          <TextInput source="name" validate={required()} />
          <TextInput source="uuid" validate={required()} />
      </SimpleForm>
    </Edit>
  );
});