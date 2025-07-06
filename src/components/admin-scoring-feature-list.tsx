import { FC, memo } from "react";
import { CreateButton, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, List, ReferenceArrayField, SearchInput, SelectColumnsButton, SingleFieldList, TextField, TopToolbar, WrapperField } from "react-admin";
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
      <SelectColumnsButton preferenceKey="scoringFeature.table" sx={{
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

export const AdminScoringFeatureList: FC = memo(() => {
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
        preferenceKey="scoringFeature.table"
        rowSx={(i) => {
          if (i.type == 'social') {
            return {
              backgroundColor: 'rgb(76, 175, 80, 0.1)'
            };
          }
          if (i.type == 'behavioral') {
            return {
              backgroundColor: 'rgb(239, 83, 80, 0.1)'
            };
          }
          return {};
        }}
      >
        <TextField source="id" label="ID" />
        
        <FunctionField label="NAME" render={i => (
          <Chip label={i.name}/>
        )} />
        <FunctionField label="TYPE" render={i => (
          <Chip label={i.type.toUpperCase()}/>
        )} />

        <ReferenceArrayField label="SCORING CONDITIONS" source="scoringConditions" reference="scoring-conditions">
          <SingleFieldList>
            <FunctionField source="name" render={i => (
              <Chip label={i.name}/>
            )}/>
          </SingleFieldList>
        </ReferenceArrayField>
        
        <DateField
          label="UPDATED AT"
          source="updatedAt" showTime showDate />
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