import { FC, memo } from "react";
import { Button, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, Link, List, SearchInput, SelectColumnsButton, TextField, TopToolbar, useRecordContext, WrapperField } from "react-admin";
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

  return (
    <List filters={filters} empty={empty} actions={actions} emptyWhileLoading sx={{
      '& .RaList-actions': {
        alignItems: 'center',
      },
      '& .RaList-actions form': {
        minHeight: 'auto',
      }
    }}>
      <DatagridConfigurable preferenceKey="userProfile.table" rowClick={false} rowSx={(i) => {
        if (i.scoreStatus == 'review') {
          return {
            backgroundColor: 'rgb(255, 193, 7, 0.1)'
          };
        }
        if (i.scoreStatus == 'accept') {
          return {
            backgroundColor: 'rgb(76, 175, 80, 0.1)'
          };
        }
        if (i.scoreStatus == 'reject') {
          return {
            backgroundColor: 'rgb(239, 83, 80, 0.1)'
          };
        }
        return {};
      }}>
        <TextField source="id" label="ID" />
        <TextField source="citizenshipCountry" label="CITIZENSHIP COUNTRY" />
        <TextField source="residenceCountry" label="RESIDENCE COUNTRY" />

        <DateField source="dateOfBirth" label="DATE OF BIRTH" showDate />

        <TextField source="score" label="SCORE" />
        <FunctionField source="scorePayout" label="SCORE PAYOUT" render={i => (
          `${i.scorePayout} USDT`
        )}/>

        <DateField source="updatedAt" label="UPDATED AT" showTime showDate />

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