import { FC, memo } from "react";
import { Button, DatagridConfigurable, DateField, DeleteButton, ExportButton, FunctionField, Link, List, SearchInput, SelectColumnsButton, TextField, TopToolbar, useRecordContext, WrapperField } from "react-admin";
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

const UserButton: FC = memo(() => {
  const i = useRecordContext();
  return (
    <Button
      component={Link}
      to={`/users/${i?.id}`}
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
      USER
    </Button>
  );
});

enum DeviceTypes {
  UNKNOWN,
  PHONE,
  TABLET,
  TV,
  DESKTOP,
}

export const AdminUserDeviceList: FC = memo(() => {
  const actions = <Actions />;
  const empty = <AdminEmpty />;

  // console.log(searchParams)
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
        <TextField source="name" label="NAME" />
        <TextField source="model" label="MODEL" />
        <FunctionField label="TYPE" render={i => DeviceTypes[i.type]} />

        <TextField source="manufacturer" label="MANUFACTURE" />
        <TextField source="ipAddress" label="IP ADDRESS" />

        <DateField label="CREATED AT" source="createdAt" showTime showDate />

        <WrapperField label="ACTIONS" textAlign="right" sortable={false}>
          <UserButton />
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