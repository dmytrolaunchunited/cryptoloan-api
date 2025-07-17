import { Close, Done } from "@mui/icons-material";
import { FC, memo, useCallback, useMemo } from "react";
import { Button, Create, required, SaveButton, SimpleForm, TextInput, NumberInput, BooleanInput, Toolbar, useRedirect, SelectInput, ReferenceArrayInput, AutocompleteInput, FormDataConsumer, AutocompleteArrayInput, ReferenceInput } from "react-admin";

const CreateToolbar: FC = memo(() => {
  const redirect = useRedirect();
  
  const onClickCancel = useMemo(() => () => {
    redirect('/scoring-questions');
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

export const AdminScoringQuestionCreate: FC = memo(() => {
  const redirect = useRedirect();

  const toolbar = <CreateToolbar />;

  const onSuccess = useCallback(() => {
    redirect(`/scoring-questions`);
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
          <AutocompleteInput size="small" validate={required()} optionText={(i) => i.name} />
        </ReferenceInput>

        <ReferenceArrayInput source="scoringFeatures" reference="scoring-features">
          <AutocompleteArrayInput size="small" optionText="name" validate={required()} />
        </ReferenceArrayInput>
        
        <BooleanInput size="small" source="isActive" label="Active" defaultValue={true} fullWidth sx={{
          marginLeft: 1,
        }}/>
      </SimpleForm>
    </Create>
  );
});
