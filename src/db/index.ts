import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import  * as schema from "./schema";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });

export enum ScoringTypes {
  Social = 'social',
  Behavioral = 'behavioral',
}

export enum ScoringFeatureGenderTypes {
  A, // 'male',
  B, // 'female',
}

export enum ScoringFeatureFlagTypes {
  Yes,
  No,
}

export enum ScoringFeatureEducationTypes {
  A, // 'minimum-secondary',
  B, // 'general-secondary',
}

export enum ScoringFeatureEmployedTypes {
  A, // 'official',
  B, // 'informal',
  C, // 'entrepreneur',
  D, // 'freelance',
  E, // 'student',
  F, // 'unemployed',
}

export enum ScoringFeatures {
  Age = "age",
  Gender = "gender",
  IsEmployed = "is_employed",
  IsMarried = "is_married",
  Education = "education",
  EmploymentType = "employment_type",
  MonthlyIncome = "monthly_income",
  HasActiveLoans = "has_active_loans",
  HasCryptoWallets = "has_crypto_wallets",
  CryptoUsageDuration = "crypto_usage_duration",
  NumberOfChildren = "number_of_children",
  SavingsAfterExpenses = "savings_after_expenses",
  HasBankAccounts = "has_bank_accounts",
  BankAccountBalance = "bank_account_balance",
  HasUtilityDebt = "has_utility_debt",
  SmsIncomeDetected = "sms_income_detected",
  SmsOverdueDetectedLast30Days = "sms_overdue_detected_last_30_days",
  PaidLoansByClientPhone = "paid_loans_by_client_phone",
  ZodiacCompletionTime = "zodiac_completion_time",
  PaidLoansByClientPhoneDuplicate = "paid_loans_by_client_phone_duplicate",
  PaidLoansByContactPhoneBorrowers = "paid_loans_by_contact_phone_borrowers",
  PaidLoansByContactPhoneContacts = "paid_loans_by_contact_phone_contacts",
  NumberOfPaidLoansInCompany = "number_of_paid_loans_in_company",
  QualityOfPaidLoansMax = "quality_of_paid_loans_max",
  QualityOfPaidLoansLast = "quality_of_paid_loans_last",
}

export enum Applications {
  Bitloan = 'bitloan',
}

export const generateApplications = async () => {
  await db
    .insert(schema.applications)
    .values([
      {
        name: Applications.Bitloan,
        uuid: '2bb32b42-3523-4061-85a7-50c8cc5c37ad',
      }
    ])
}

export const generateConditions = async () => { 
  const rows = await db
    .select()
    .from(schema.applications)
    .where(eq(schema.applications.name, Applications.Bitloan))
    .limit(1);

  const applicationId = rows[0].id;

  await db
    .insert(schema.conditions)
    .values([
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Age,
        scoringFeatureOption: '0-19.99',
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Age,
        scoringFeatureOption: '20-25',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Age,
        scoringFeatureOption: '25.01-35',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Age,
        scoringFeatureOption: '35.01-49.99',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Age,
        scoringFeatureOption: '50-65',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Gender,
        scoringFeatureOption: ScoringFeatureGenderTypes.A.toString(),
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Gender,
        scoringFeatureOption: ScoringFeatureGenderTypes.B.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsEmployed,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsEmployed,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsMarried,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsMarried,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Education,
        scoringFeatureOption: ScoringFeatureEducationTypes.A.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Education,
        scoringFeatureOption: ScoringFeatureEducationTypes.B.toString(),
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: ScoringFeatureEmployedTypes.A.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: ScoringFeatureEmployedTypes.B.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: ScoringFeatureEmployedTypes.C.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: ScoringFeatureEmployedTypes.D.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: ScoringFeatureEmployedTypes.E.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: ScoringFeatureEmployedTypes.F.toString(),
        scoring: 0,
      },
      {
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.MonthlyIncome,
        scoringFeatureOption: 'lte 140',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.MonthlyIncome,
        scoringFeatureOption: '140.01-200',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.MonthlyIncome,
        scoringFeatureOption: 'gte 200.01',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasActiveLoans,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasActiveLoans,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasCryptoWallets,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasCryptoWallets,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.CryptoUsageDuration,
        scoringFeatureOption: 'lte 6',
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.CryptoUsageDuration,
        scoringFeatureOption: '6.01-12',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.CryptoUsageDuration,
        scoringFeatureOption: 'gt 12',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.NumberOfChildren,
        scoringFeatureOption: 'eq 0',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.NumberOfChildren,
        scoringFeatureOption: '1-2',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.NumberOfChildren,
        scoringFeatureOption: 'gt 3',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SavingsAfterExpenses,
        scoringFeatureOption: 'eq 0',
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SavingsAfterExpenses,
        scoringFeatureOption: 'lte 50',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SavingsAfterExpenses,
        scoringFeatureOption: '50.01-100',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SavingsAfterExpenses,
        scoringFeatureOption: 'gt 100',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasBankAccounts,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasBankAccounts,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.BankAccountBalance,
        scoringFeatureOption: 'eq 0',
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.BankAccountBalance,
        scoringFeatureOption: '0.01-100',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.BankAccountBalance,
        scoringFeatureOption: '100.01-150',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.BankAccountBalance,
        scoringFeatureOption: '150.01-200',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.BankAccountBalance,
        scoringFeatureOption: 'gt 200',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasUtilityDebt,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: -10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasUtilityDebt,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsIncomeDetected,
        scoringFeatureOption: 'eq 0',
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsIncomeDetected,
        scoringFeatureOption: '0.01-50',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsIncomeDetected,
        scoringFeatureOption: '50.01-100',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsIncomeDetected,
        scoringFeatureOption: 'gt 100.01',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsOverdueDetectedLast30Days,
        scoringFeatureOption: ScoringFeatureFlagTypes.Yes.toString(),
        scoring: -10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsOverdueDetectedLast30Days,
        scoringFeatureOption: ScoringFeatureFlagTypes.No.toString(),
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: 'eq 0',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: 'lte 15',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: 'lte 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: 'lte 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: 'gt 45',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.ZodiacCompletionTime,
        scoringFeatureOption: 'lt 15',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.ZodiacCompletionTime,
        scoringFeatureOption: 'gt 15',
        scoring: -2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: 'eq 0',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: 'lte 15',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: 'lte 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: 'lte 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: 'gt 45',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: 'eq 0',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: 'lte 15',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: 'lte 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: 'lte 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: 'gt 45',
        scoring: 0
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: 'eq 0',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: 'lte 15',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: 'lte 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: 'lte 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: 'gt 45',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: 'eq 0',
        scoring: 0
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: 'eq 1',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: 'eq 2',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: 'eq 3',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: '4-5',
        scoring: 15
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: 'gt 5',
        scoring: 25
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: 'gt 60',
        scoring: -25
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: '45-60',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: '31-45',
        scoring: 0
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: '16-30',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: '1-15',
        scoring: 15
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: 'eq 0',
        scoring: 25
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: 'gt 0',
        scoring: -25
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: '45-60',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: '31-45',
        scoring: 0
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: '16-30',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: '1-15',
        scoring: 15
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: 'eq 0',
        scoring: 25
      },
    ]);
}
