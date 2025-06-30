import { FC, memo } from "react";
import { BooleanField, CreateButton, DataTable, DateField, ExportButton, FunctionField, List, NumberField, ReferenceField, SearchInput, TopToolbar } from "react-admin";
import { Chip } from '@mui/material';

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

  return (
    <List filters={filters} actions={actions} sx={{
      '& .RaList-actions': {
        alignItems: 'center',
      },
       '& .RaList-actions form': {
        minHeight: 'auto',
      }
    }}>
      <DataTable rowSx={(i: any) => ({
        backgroundColor: i.scoringType === 'social' ? 'rgb(76, 175, 80, 0.1)' : 'rgb(239, 83, 80, 0.1)',
      })}>
        <DataTable.Col source="id" label="ID" />
        <DataTable.Col label="APPLICATION">
          <ReferenceField source="applicationId" reference="applications">
            <FunctionField render={i => (
              <Chip label={i.name.toUpperCase()}/>
            )} />
          </ReferenceField>
        </DataTable.Col>
        <DataTable.Col label="SCORING TYPE">
          <FunctionField render={i => (
            <Chip label={scoringTypes[i.scoringType]}/>
          )} />
        </DataTable.Col>
        <DataTable.Col label="SCORING FEATURE">
          <FunctionField render={i => (
            <Chip label={scoringFeatures[i.scoringFeature]}/>
          )} />
        </DataTable.Col>
        <DataTable.Col label="SCORING FEATURE OPTION" width={300}>
          <FunctionField render={i => {
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
        </DataTable.Col>
        <DataTable.Col label="SCORING">
          <NumberField source="scoring" />
        </DataTable.Col>
        <DataTable.Col label="ACTIVE">
          <BooleanField source="isActive" />
        </DataTable.Col>
        <DataTable.Col label="UPDATED AT" width={200}>
          <DateField source="updatedAt" showTime showDate />
        </DataTable.Col>
      </DataTable>
    </List>
  );
});