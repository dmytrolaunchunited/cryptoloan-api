import { FC, memo } from "react";
import { CreateButton, DataTable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, List, SearchInput, Title, TopToolbar } from "react-admin";
import { Chip } from '@mui/material';
import { Route } from 'react-router';
import { AdminApplicationCreate } from "./admin-application-create";

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

export const AdminApplicationList: FC = memo(() => {
  const actions = <Actions />;

  return (
    <List filters={filters} actions={actions} sx={{
      '& .RaList-actions': {
        alignItems: 'center',
      },
      '& .RaList-actions form': {
        minHeight: 'auto',
      }
    }}>
      <DataTable>
        <DataTable.Col source="id" label="ID" />
        <DataTable.Col source="name" label="NAME">
          <FunctionField render={i => (
            <Chip label={i.name.toUpperCase()}/>
          )} />
        </DataTable.Col>
        <DataTable.Col label="UPDATED AT">
          <DateField source="updatedAt" showTime showDate />
        </DataTable.Col>
        <DataTable.Col>
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
        </DataTable.Col>
      </DataTable>
    </List>
  );
});