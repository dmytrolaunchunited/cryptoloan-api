import { Close, Done } from "@mui/icons-material";
import { FC, memo, useCallback, useMemo } from "react";
import { BooleanInput, Button, Edit, NumberInput, required, SaveButton, SelectInput, SimpleForm, TextInput, Toolbar, useRedirect } from "react-admin";

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
  const redirect = useRedirect();

  const toolbar = <EditToolbar />;

  const onSuccess = useCallback(() => {
    redirect(`/applications`);
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
        <TextInput size="small" source="name" validate={required()} />
        <TextInput size="small" source="uuid" validate={required()} />

        <NumberInput size="small" source="scoreValidationMax" validate={required()} />
        <NumberInput size="small" source="scoreValidationMin" validate={required()} />

        <SelectInput size="small" source="currency" fullWidth  validate={required()} choices={[
          { id: 'ngn', name: 'NGN' },
        ]} />

        <BooleanInput size="small" source="isActive" label="Active" defaultValue={true} fullWidth sx={{
          marginLeft: 1,
        }}/>
      </SimpleForm>
    </Edit>
  );
});