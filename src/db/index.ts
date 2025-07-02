import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client, schema });

export enum ScoringTypes {
  Social = 'social',
  Behavioral = 'behavioral',
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
        scoringFeatureOption: '0', // Male
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Gender,
        scoringFeatureOption: '1', // Female
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsEmployed,
        scoringFeatureOption: '0', // Yes
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsEmployed,
        scoringFeatureOption: '1', // No
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsMarried,
        scoringFeatureOption: '0', // Yes
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.IsMarried,
        scoringFeatureOption: '1', // No
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Education,
        scoringFeatureOption: '0', // Minimum Secondary
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.Education,
        scoringFeatureOption: '1', // General Secondary
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: '0', // Official
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: '1', // Informal
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: '2', // Entrepreneur
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: '3', // Freelance
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: '4', // Student
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.EmploymentType,
        scoringFeatureOption: '5', // Unemployed
        scoring: 0,
      },
      {
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.MonthlyIncome,
        scoringFeatureOption: '<= 140',
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
        scoringFeatureOption: '>= 200.01',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasActiveLoans,
        scoringFeatureOption: '0', // Yes
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasActiveLoans,
        scoringFeatureOption: '1', // No
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasCryptoWallets,
        scoringFeatureOption: '0', // Yes
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasCryptoWallets,
        scoringFeatureOption: '1', // No
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.CryptoUsageDuration,
        scoringFeatureOption: '<= 6',
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
        scoringFeatureOption: '> 12',
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.NumberOfChildren,
        scoringFeatureOption: '= 0',
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
        scoringFeatureOption: '> 3',
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SavingsAfterExpenses,
        scoringFeatureOption: '= 0',
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SavingsAfterExpenses,
        scoringFeatureOption: '<= 50',
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
        scoringFeatureOption: '> 100',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasBankAccounts,
        scoringFeatureOption: '0', // Yes
        scoring: 2,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasBankAccounts,
        scoringFeatureOption: '1', // No
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.BankAccountBalance,
        scoringFeatureOption: '= 0',
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
        scoringFeatureOption: '> 200',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasUtilityDebt,
        scoringFeatureOption: '0', // Yes
        scoring: -10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.HasUtilityDebt,
        scoringFeatureOption: '1', // No
        scoring: 5,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsIncomeDetected,
        scoringFeatureOption: '= 0',
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
        scoringFeatureOption: '> 100.01',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsOverdueDetectedLast30Days,
        scoringFeatureOption: '0', // Yes
        scoring: -10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Social,
        scoringFeature: ScoringFeatures.SmsOverdueDetectedLast30Days,
        scoringFeatureOption: '1', // No
        scoring: 0,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: '= 0',
        scoring: 10,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: '<= 15',
        scoring: 7,
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: '<= 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: '<= 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhone,
        scoringFeatureOption: '> 45',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.ZodiacCompletionTime,
        scoringFeatureOption: '< 15',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.ZodiacCompletionTime,
        scoringFeatureOption: '> 15',
        scoring: -2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: '= 0',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: '<= 15',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: '<= 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: '<= 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByClientPhoneDuplicate,
        scoringFeatureOption: '> 45',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: '= 0',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: '<= 15',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: '<= 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: '<= 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneBorrowers,
        scoringFeatureOption: '> 45',
        scoring: 0
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: '= 0',
        scoring: 10
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: '<= 15',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: '<= 30',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: '<= 45',
        scoring: 2
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.PaidLoansByContactPhoneContacts,
        scoringFeatureOption: '> 45',
        scoring: -5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: '= 0',
        scoring: 0
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: '= 1',
        scoring: 5
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: '= 2',
        scoring: 7
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.NumberOfPaidLoansInCompany,
        scoringFeatureOption: '= 3',
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
        scoringFeatureOption: '> 5',
        scoring: 25
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansMax,
        scoringFeatureOption: '> 60',
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
        scoringFeatureOption: '= 0',
        scoring: 25
      },
      { 
        applicationId,
        scoringType: ScoringTypes.Behavioral,
        scoringFeature: ScoringFeatures.QualityOfPaidLoansLast,
        scoringFeatureOption: '> 0',
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
        scoringFeatureOption: '= 0',
        scoring: 25
      },
    ]);
}
