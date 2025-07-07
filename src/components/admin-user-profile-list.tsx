import { FC, memo } from "react";
import { Button, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, Link, List, SearchInput, SelectColumnsButton, TextField, TopToolbar, useRecordContext, WrapperField } from "react-admin";
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
      <SelectColumnsButton preferenceKey="userProfile.table" sx={{
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
      to={`/users/${i?.userId}`}
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

export const AdminUserProfileList: FC = memo(() => {
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
      <DatagridConfigurable preferenceKey="userProfile.table" rowClick={false}>
        <TextField source="id" label="ID" />
        <TextField source="firstName" label="FIRST NAME" />
        <TextField source="lastName" label="LAST NAME" />
        <TextField source="citizenshipCountry" label="CITIZENSHIP COUNTRY" />
        <TextField source="residenceCountry" label="RESIDENCE COUNTRY" />

        <DateField label="DATE OF BIRTH" source="dateOfBirth" showDate />

        <DateField label="UPDATED AT" source="updatedAt" showTime showDate />

        <WrapperField label="ACTIONS" textAlign="right" sortable={false}>
          <UserButton />
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