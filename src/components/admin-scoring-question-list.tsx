import { FC, memo } from "react";
import { BooleanField, CreateButton, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, List, ReferenceArrayField, ReferenceField, SearchInput, SelectColumnsButton, SingleFieldList, TextField, TopToolbar, WrapperField } from "react-admin";
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
      <SelectColumnsButton preferenceKey="scoringQuestion.table" sx={{
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

export const AdminScoringQuestionList: FC = memo(() => {
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
        preferenceKey="scoringQuestion.table"
      >
        <TextField source="id" label="ID" />
        
        <ReferenceField source="applicationId" reference="applications" label="APPLICATION">
          <TextField source="name" />
        </ReferenceField>

        <TextField source="name" label="NAME" />

        <ReferenceArrayField label="SCORING FEATURES" source="scoringFeatures" reference="scoring-features">
          <SingleFieldList>
            <FunctionField source="name" render={i => (
              <Chip label={i.name}/>
            )}/>
          </SingleFieldList>
        </ReferenceArrayField>

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
