import { FC, memo } from "react";
import { BooleanField, CreateButton, DatagridConfigurable, DateField, DeleteButton, EditButton, ExportButton, FunctionField, List, NumberField, ReferenceField, SearchInput, SelectColumnsButton, TextField, TopToolbar, WrapperField } from "react-admin";
import { Chip } from '@mui/material';
import { AdminEmpty } from "./admin-empty";

const scoringTypes: Record<string, string> = {
  social: 'Social Scoring',
  behavioral: 'Behavioral Scoring',
}

const scoringFeatures: Record<string, string> = {
  age: "Age",
  gender: "Gender",
  is_employed: "Employment status",
  is_married: "Marital status",
  education: "Education",
  employment_type: "Type of employment",
  monthly_income: "Monthly income",
  has_active_loans: "Has active loans",
  has_crypto_wallets: "Has crypto wallets",
  crypto_usage_duration: "Crypto usage duration",
  number_of_children: "Number of children",
  savings_after_expenses: "Savings after expenses",
  has_bank_accounts: "Has bank accounts",
  bank_account_balance: "Bank account balance",
  has_utility_debt: "Has utility debt",
  sms_income_detected: "SMS income detected",
  sms_overdue_detected_last_30_days: "SMS overdue detected (last 30 days)",
  paid_loans_by_client_phone: "Paid loans by client phone number",
  zodiac_completion_time: "Zodiac sign completion time",
  paid_loans_by_client_phone_duplicate: "Paid loans by client phone number (duplicate)",
  paid_loans_by_contact_phone_borrowers: "Paid loans by contact phone number among borrowers",
  paid_loans_by_contact_phone_contacts: "Paid loans by contact phone number among contacts",
  number_of_paid_loans_in_company: "Number of paid loans in the company",
  quality_of_paid_loans_max: "Quality of paid loans (max DPD)",
  quality_of_paid_loans_last: "Quality of paid loans (DPD of last paid loan, if more than one)",
};

const filters = [
  <SearchInput source="q" alwaysOn sx={{
    '& .MuiInputBase-root': {
      paddingRight: 1,
    }
  }} />,
];

const Actions = memo(() => {
  return (
    <TopToolbar>
      <SelectColumnsButton preferenceKey="condition.table" sx={{
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

export const AdminConditionList: FC = memo(() => {
  const actions = <Actions />;
  const empty = <AdminEmpty />;

  return (
    <List filters={filters} empty={empty} actions={actions} sx={{
      '& .RaList-actions': {
        alignItems: 'center',
      },
      '& .RaList-actions form': {
        minHeight: 'auto',
      }
    }}>
      <DatagridConfigurable
        preferenceKey="condition.table"
        rowSx={(i: any) => ({
          backgroundColor: i.scoringType === 'social' ? 'rgb(76, 175, 80, 0.1)' : 'rgb(239, 83, 80, 0.1)',
        })}
      >
        <TextField
          source="id"
          label="ID"
        />
        <ReferenceField label="APPLICATION" source="applicationId" reference="applications">
          <FunctionField render={i => (
            <Chip label={i.name.toUpperCase()}/>
          )} />
        </ReferenceField>
        <FunctionField label="SCORING TYPE" render={i => (
          <Chip label={scoringTypes[i.scoringType]}/>
        )} />
        <FunctionField label="SCORING FEATURE" render={i => (
          <Chip label={scoringFeatures[i.scoringFeature]}/>
        )} />

        <FunctionField label="SCORING FEATURE OPTION" render={i => {
          // if (i.scoringFeatureOption.includes('eq')) {
          //   const [, value] = i.scoringFeatureOption.split('eq');
          //   return `=${value}`;
          // }
          // if (i.scoringFeatureOption.includes('lte')) {
          //   const [, value] = i.scoringFeatureOption.split('lte');
          //   return `<=${value}`;
          // }
          // if (i.scoringFeatureOption.includes('lt')) {
          //   const [, value] = i.scoringFeatureOption.split('lt');
          //   return `<${value}`;
          // }
          // if (i.scoringFeatureOption.includes('gte')) {
          //   const [, value] = i.scoringFeatureOption.split('gte');
          //   return `>=${value}`;
          // }
          // if (i.scoringFeatureOption.includes('gt')) {
          //   const [, value] = i.scoringFeatureOption.split('gt');
          //   return `>${value}`;
          // }
          return i.scoringFeatureOption
        }} />

        <NumberField label="SCORING" source="scoring" />
        <BooleanField label="ACTIVE" source="isActive" />
        <DateField label="UPDATED AT" source="updatedAt" showTime showDate />

        <WrapperField label="ACTIONS" source="createdAt" textAlign="right" sortable={false}>
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