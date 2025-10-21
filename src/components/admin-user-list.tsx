import { FC, memo } from "react";
import { Button, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, Link, List, ReferenceField, SearchInput, SelectColumnsButton, TextField, TopToolbar, useRecordContext, WrapperField } from "react-admin";
import { Chip } from '@mui/material';
import { AdminEmpty } from "./admin-empty";

const filters = [
  <SearchInput source="q" alwaysOn sx={{
    '& .MuiInputBase-root': {
      paddingRight: 1,
    }
  }} />,
];

const FeatureButton: FC = memo(() => {
  const i = useRecordContext();
  const filter = JSON.stringify({ userId: i?.id });
  const searchParams = new URLSearchParams({ filter });
  return (
    <Button
      component={Link}
      to={`/user-features?${searchParams.toString()}`}
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
      FEATURES
    </Button>
  );
});

const ProfileButton: FC = memo(() => {
  const i = useRecordContext();
  const filter = JSON.stringify({ userId: i?.id });
  const searchParams = new URLSearchParams({ filter });
  return (
    <Button
      component={Link}
      to={`/user-profiles?${searchParams.toString()}`}
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
      PROFILE
    </Button>
  );
});

const DeviceButton: FC = memo(() => {
  const i = useRecordContext();
  const filter = JSON.stringify({ userId: i?.id });
  const searchParams = new URLSearchParams({ filter });
  return (
    <Button
      component={Link}
      to={`/user-devices?${searchParams.toString()}`}
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
      DEVICE
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

        <ReferenceField source="applicationId" reference="applications" label="APPLICATION">
          <TextField source="name" />
        </ReferenceField>

        <DateField label="UPDATED AT" source="updatedAt" showTime showDate />

        <WrapperField label="ACTIONS" textAlign="right" sortable={false}>
          <FeatureButton />
          <ProfileButton />
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