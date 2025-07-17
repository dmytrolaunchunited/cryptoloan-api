import { Close, Done } from "@mui/icons-material";
import { FC, memo, useCallback, useMemo } from "react";
import { Button, required, SaveButton, SimpleForm, TextInput, BooleanInput, Toolbar, useRedirect, SelectInput, Edit, ReferenceArrayInput, AutocompleteArrayInput, ReferenceInput, AutocompleteInput } from "react-admin";

const EditToolbar: FC = memo(() => {
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

export const AdminScoringFeatureEdit: FC = memo(() => {
  const redirect = useRedirect();

  const toolbar = <EditToolbar />;

  const onSuccess = useCallback(() => {
    redirect(`/scoring-features`);
  }, [redirect]);

  const transform = useCallback((data: any) => {
    delete data.createdAt
    delete data.updatedAt;
    return data;
  }, []);

  return (
    <Edit mutationMode="pessimistic" mutationOptions={{ onSuccess }} transform={transform} sx={{
      '& .RaCreate-main': {
        marginTop: 1,
      }
    }}>
      <SimpleForm toolbar={toolbar} sx={{
        paddingBottom: 0,
      }}>
        <TextInput disabled size="small" source="id" />
        <TextInput size="small" source="name" fullWidth validate={required()} />
        <TextInput size="small" source="description" fullWidth />

        <ReferenceInput source="applicationId" reference="applications">
          <AutocompleteInput size="small" validate={required()} optionText={(i) => i.name} />
        </ReferenceInput>
        
        <SelectInput size="small" source="type" validate={required()}  fullWidth choices={[
          { id: 'social', name: 'Social' },
          { id: 'behavioral', name: 'Behavioral' },
        ]} />
        <ReferenceArrayInput source="scoringConditions" reference="scoring-conditions">
          <AutocompleteArrayInput size="small" optionText="name" validate={required()} />
        </ReferenceArrayInput>

        <BooleanInput size="small" source="isActive" label="Active" defaultValue={true} fullWidth sx={{
          marginLeft: 1,
        }}/>
      </SimpleForm>
    </Edit>
  );
});
