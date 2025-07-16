import { FC, memo } from "react";
import { Button, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, Link, List, ReferenceArrayField, ReferenceField, SearchInput, SelectColumnsButton, SingleFieldList, TextField, TopToolbar, useRecordContext, WrapperField } from "react-admin";
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
      <SelectColumnsButton preferenceKey="userFeature.table" sx={{
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

export const AdminUserFeatureList: FC = memo(() => {
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
      <DatagridConfigurable preferenceKey="userFeature.table" rowClick={false}>
        <TextField source="id" label="ID" />
        <ReferenceField source="scoringFeatureId" reference="scoring-features" label="SCORING FEATURE">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="scoringConditionId" reference="scoring-conditions" label="SCORING CONDITION">
          <TextField source="name" />
        </ReferenceField>

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