import { FC, memo } from "react";
import { BooleanField, CreateButton, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, List, SearchInput, SelectColumnsButton, SelectField, TextField, TopToolbar, WrapperField } from "react-admin";
import { Chip } from '@mui/material';
import { AdminEmpty } from "./admin-empty";

const filters = [
  <SearchInput source="q" alwaysOn sx={{
    '& .MuiInputBase-root': {
      paddingRight: 1,
    }
  }} />,
];

const Actions: FC = memo(() => {
  return (
    <TopToolbar>
      <SelectColumnsButton preferenceKey="scoringCondition.table" sx={{
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
        }
      }} />
      <CreateButton sx={{
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
        }
      }} />
      <ExportButton sx={{
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
        }
      }} />
    </TopToolbar>
  );
});

export const AdminScoringConditionList: FC = memo(() => {
  const actions = <Actions />;
  const empty = <AdminEmpty />;

  return (
    <List filters={filters} empty={empty} actions={actions} emptyWhileLoading sx={{
      '& .RaList-actions': {
        alignItems: 'center',
      },
      '& .RaList-actions form': {
        minHeight: 'auto',
      }
    }}>
      <DatagridConfigurable
        preferenceKey="scoringCondition.table"
      >
        <TextField source="id" label="ID" />

        <FunctionField label="NAME" render={i => (
          <Chip label={i.name}/>
        )} />

        <TextField source="label" label="LABEL" />
        <TextField source="condition" label="CONDITION" />
        <TextField source="value" label="VALUE" />

        <SelectField source="relation" label="RELATION" choices={[
          { id: 'dateOfBirth', name: 'Day Of Birth' },
          { id: 'citizenshipCountry', name: 'Citizenship Country' },
          { id: 'residenceCountry', name: 'Residence Country' },
        ]} />

        <BooleanField label="ACTIVE" source="isActive" />

        <DateField label="UPDATED AT" source="updatedAt" showTime showDate />

        <WrapperField label="ACTIONS" textAlign="right" sortable={false}>
          <EditButton sx={{
            '&.MuiButtonBase-root': {
              padding: 1,
              borderRadius: 18,
              paddingX: 2,
            }
          }}/>
          <DeleteButton sx={{
            '&.MuiButtonBase-root': {
              padding: 1,
              borderRadius: 18,
              paddingX: 2,
            }
          }}/>
        </WrapperField>
      </DatagridConfigurable>
    </List>
  );
});