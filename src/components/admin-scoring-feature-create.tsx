import { Close, Done } from "@mui/icons-material";
import { FC, memo, useCallback, useMemo } from "react";
import { Button, Create, required, SaveButton, SimpleForm, TextInput, BooleanInput, Toolbar, useRedirect, SelectInput, ReferenceArrayInput, AutocompleteArrayInput, ReferenceInput, AutocompleteInput } from "react-admin";

const CreateToolbar: FC = memo(() => {
  const redirect = useRedirect();
  
  const onClickCancel = useMemo(() => () => {
    redirect('/scoring-features');
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

export const AdminScoringFeatureCreate: FC = memo(() => {
  const redirect = useRedirect();

  const toolbar = <CreateToolbar />;

  const onSuccess = useCallback(() => {
    redirect(`/scoring-features`);
  }, [redirect]);

  return (
    <Create mutationOptions={{ onSuccess }} sx={{
      '& .RaCreate-main': {
        marginTop: 1,
      }
    }}>
      <SimpleForm toolbar={toolbar} sx={{
        paddingBottom: 0,
      }}>
        <TextInput size="small" source="name" fullWidth validate={required()} />
        <TextInput size="small" source="description" fullWidth />
        
        <ReferenceInput source="applicationId" reference="applications">
          <AutocompleteInput size="small" validate={required()} optionText={(i) => i.name.toUpperCase()} />
        </ReferenceInput>

        <SelectInput size="small" source="type" validate={required()} fullWidth choices={[
          { id: 'social', name: 'Social' },
          { id: 'behavioral', name: 'Behavioral' },
        ]} />
        <ReferenceArrayInput source="scoringConditions" reference="scoring-conditions">
          <AutocompleteArrayInput size="small" validate={required()} optionText="name" />
        </ReferenceArrayInput>

        <BooleanInput size="small" source="isActive" label="Active" defaultValue={true} fullWidth sx={{
          marginLeft: 1,
        }}/>
      </SimpleForm>
    </Create>
  );
});
