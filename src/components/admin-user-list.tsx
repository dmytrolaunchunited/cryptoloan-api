import { FC, memo } from "react";
import { Button, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, Link, List, SearchInput, SelectColumnsButton, TextField, TopToolbar, useRecordContext, WrapperField } from "react-admin";
import { Chip } from '@mui/material';
import { AdminEmpty } from "./admin-empty";

const filters = [
  <SearchInput source="q" alwaysOn sx={{
    '& .MuiInputBase-root': {
      paddingRight: 1,
    }
  }} />,
];

const DeviceButton: FC = memo(() => {
  const i = useRecordContext();
  return (
    <Button
      component={Link}
      to={`/user-devices?filter={"userId":${i?.id}}`}
      sx={{
        '& .MuiButton-icon': {
          margin: 0,
        },
        '&.MuiButtonBase-root': {
          padding: 1,
          borderRadius: 18,
          paddingX: 2,
        }
      }}
    >
      DEVICE INFO
    </Button>
  );
});

const Actions: FC = memo(() => {
  return (
    <TopToolbar>
      <SelectColumnsButton preferenceKey="user.table" sx={{
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

export const AdminUserList: FC = memo(() => {
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
      <DatagridConfigurable preferenceKey="user.table" rowClick={false}>
        <TextField source="id" label="ID" />

        <TextField source="phone" label="PHONE" />
        <TextField source="email" label="EMAIL" />

        <FunctionField label="PRIVY ID" render={i => {
          const visible = i.privy.slice(-5);
          const masked = '*'.repeat(5);
          return (
            <Chip label={`${masked}${visible}`}/>
          );
        }} />

        <FunctionField label="APPLICATION" render={i => (
          <Chip label={i.application.name.toUpperCase()}/>
        )} />

        <DateField label="UPDATED AT" source="updatedAt" showTime showDate />

        <WrapperField label="ACTIONS" textAlign="right" sortable={false}>
          <DeviceButton />
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