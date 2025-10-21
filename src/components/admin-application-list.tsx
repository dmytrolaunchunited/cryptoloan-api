import { FC, memo } from "react";
import { BooleanField, CreateButton, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, List, NumberField, SearchInput, SelectColumnsButton, SelectField, TextField, TopToolbar, WrapperField } from "react-admin";
import { Chip } from '@mui/material';
import { AdminEmpty } from "./admin-empty";

const filters = [
  <SearchInput source="q" size="small" alwaysOn sx={{
    '& .MuiInputBase-root': {
      paddingRight: 1,
      height: "35px",
    }
  }} />,
];

const Actions: FC = memo(() => {
  return (
    <TopToolbar>
      <SelectColumnsButton size="small"  preferenceKey="application.table" sx={{
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
          textTransform: "none"
        }
      }} />
      <CreateButton size="small" sx={{
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
          textTransform: "none"
        }
      }} />
      <ExportButton size="small" sx={{
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
          textTransform: "none"
        }
      }} />
    </TopToolbar>
  );
});

export const AdminApplicationList: FC = memo(() => {
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
        preferenceKey="application.table"
      >
        <TextField
          source="id"
          label="ID"
        />
        <FunctionField label="Name" render={i => (
          <Chip size="small" sx={{
            p: 0.5
          }} label={i.name.toUpperCase()}/>
        )} />

        <SelectField source="currency" label="Currency" choices={[
          { id: 'ngn', name: 'NGN' },
        ]} />

        <SelectField source="stablecoin" label="Stablecoin" choices={[
          { id: 'usdc', name: 'USDC' },
        ]} />

        <NumberField label="Interest" source="interest" />
        <NumberField label="Fee" source="fee" />

        <NumberField label="Score Multiplier" source="scoreMultiplier" />
        <NumberField label="Score Max" source="scoreValidationMax" />
        <NumberField label="Score Min" source="scoreValidationMin" />

        <BooleanField label="Active" source="isActive" />

        <DateField
          label="Updated At"
          source="updatedAt" showTime showDate />
        <WrapperField label="Actions" textAlign="right" sortable={false}>
          <EditButton sx={{
            '&.MuiButtonBase-root': {
              padding: 1,
              borderRadius: 18,
              paddingX: 2,
              textTransform: "none"
            }
          }}/>
          <DeleteButton sx={{
            '&.MuiButtonBase-root': {
              padding: 1,
              borderRadius: 18,
              paddingX: 2,
              textTransform: "none"
            }
          }}/>
        </WrapperField>
      </DatagridConfigurable>
    </List>
  );
});