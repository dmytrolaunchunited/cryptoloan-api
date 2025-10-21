import { NextRequest, NextResponse } from "next/server";
import { count, desc,asc, SQL, and, ilike } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { applications, scoringConditions, scoringFeatures, scoringFeaturesToScoringConditions } from "../../../../db/schema";
import { db } from "../../../../db";

export const GET = async (request: NextRequest) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const [limit, offset, where, orderBy] = searchParams(request);

    const rows = await db
      .select()
      .from(applications)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const rowsCount = await db
      .select({ count: count() })
      .from(applications)
      .where(where);

    const totalCount = rowsCount[0].count.toString();
    const contentRange = `applications ${offset}-${limit - 1}/${totalCount}`
    const response = NextResponse.json(rows, { status: 200 });
      
    response.headers.set('Content-Range', contentRange);
    response.headers.set('X-Total-Count', totalCount);
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');
//  const [remainingFundsFeature] = await db
//     .insert(scoringFeatures)
//     .values({
//       name: "Remaining Funds After Expenses",
//       type: "social",
//       isActive: true,
//       applicationId: 1,
//     })
//     .returning();

//   // 2️⃣ Insert conditions
//   const remainingFundsConditions = await db
//     .insert(scoringConditions)
//     .values([
//       {
//         name: "Remaining Funds After Expenses - $0",
//         label: "$0",
//         value: "0",
//         isActive: true,
//         condition: "0",
//       },
//       {
//         name: "Remaining Funds After Expenses - $0-50",
//         label: "up to $50",
//         value: "2",
//         isActive: true,
//         condition: "0-50",
//       },
//       {
//         name: "Remaining Funds After Expenses - $50-100",
//         label: "$50-100",
//         value: "5",
//         isActive: true,
//         condition: "50.01-100",
//       },
//       {
//         name: "Remaining Funds After Expenses - more than $100",
//         label: "more than $100",
//         value: "7",
//         isActive: true,
//         condition: "100+",
//       },
//     ])
//     .returning();

//   // 3️⃣ Link feature ↔ conditions
//   const featureConditionLinks = remainingFundsConditions.map((condition) => ({
//     scoringConditionId: condition.id,
//     scoringFeatureId: remainingFundsFeature.id,
//   }));

//   await db.insert(scoringFeaturesToScoringConditions).values(featureConditionLinks);

  // const [bankAccountsFeature] = await db
  //   .insert(scoringFeatures)
  //   .values({
  //     name: "Existing Bank Accounts",
  //     type: "social",
  //     isActive: true,
  //     applicationId: 1,
  //   })
  //   .returning();

  // // 2️⃣ Insert conditions
  // const bankAccountsConditions = await db
  //   .insert(scoringConditions)
  //   .values([
  //     {
  //       name: "Existing Bank Accounts - Yes",
  //       label: "Yes",
  //       value: "2",
  //       isActive: true,
  //       condition: "1",
  //     },
  //     {
  //       name: "Existing Bank Accounts - No",
  //       label: "No",
  //       value: "0",
  //       isActive: true,
  //       condition: "0",
  //     },
  //   ])
  //   .returning();

  // // 3️⃣ Link feature ↔ conditions
  // const featureConditionLinks = bankAccountsConditions.map((condition) => ({
  //   scoringConditionId: condition.id,
  //   scoringFeatureId: bankAccountsFeature.id,
  // }));

  // await db.insert(scoringFeaturesToScoringConditions).values(featureConditionLinks);

  // const [bankBalanceFeature] = await db
  //   .insert(scoringFeatures)
  //   .values({
  //     name: "Bank Account Balance",
  //     type: "social",
  //     isActive: true,
  //     applicationId: 1,
  //   })
  //   .returning();

  // // 2️⃣ Insert conditions
  // const bankBalanceConditions = await db
  //   .insert(scoringConditions)
  //   .values([
  //     {
  //       name: "Bank Account Balance - $0",
  //       label: "$0",
  //       value: "0",
  //       isActive: true,
  //       condition: "0",
  //     },
  //     {
  //       name: "Bank Account Balance - $1-100",
  //       label: "$1-100",
  //       value: "2",
  //       isActive: true,
  //       condition: "0.01-100",
  //     },
  //     {
  //       name: "Bank Account Balance - $101-150",
  //       label: "$101-150",
  //       value: "5",
  //       isActive: true,
  //       condition: "100.01-150",
  //     },
  //     {
  //       name: "Bank Account Balance - $51-200",
  //       label: "$151-200",
  //       value: "7",
  //       isActive: true,
  //       condition: "150.01-200",
  //     },
  //     {
  //       name: "Bank Account Balance - more then 200",
  //       label: "more then $200",
  //       value: "10",
  //       isActive: true,
  //       condition: "200+",
  //     },
  //   ])
  //   .returning();

  // // 3️⃣ Link feature ↔ conditions
  // const featureConditionLinks = bankBalanceConditions.map((condition) => ({
  //   scoringConditionId: condition.id,
  //   scoringFeatureId: bankBalanceFeature.id,
  // }));

  // await db.insert(scoringFeaturesToScoringConditions).values(featureConditionLinks);
  // const [utilityDebtFeature] = await db
  //   .insert(scoringFeatures)
  //   .values({
  //     name: "Existing Debt",
  //     type: "social",
  //     isActive: true,
  //     applicationId: 1,
  //   })
  //   .returning();

  // // 2️⃣ Insert conditions
  // const utilityDebtConditions = await db
  //   .insert(scoringConditions)
  //   .values([
  //     {
  //       name: "Existing Debt - Yes",
  //       label: "Yes",
  //       value: "-10",
  //       isActive: true,
  //       condition: "1",
  //     },
  //     {
  //       name: "Existing Debt - No",
  //       label: "No",
  //       value: "5",
  //       isActive: true,
  //       condition: "0",
  //     },
  //   ])
  //   .returning();
  //     const featureConditionLinks = utilityDebtConditions.map((condition) => ({
  //   scoringConditionId: condition.id,
  //   scoringFeatureId: utilityDebtFeature.id,
  // }));
  // await db.insert(scoringFeaturesToScoringConditions).values(featureConditionLinks);

  // 3️⃣ Link feature ↔ conditions


    return response;
  } catch (error) {
    console.error('[API][GET][Admin][apps]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

const FIELDS: Record<any, PgColumn<any>> = {
  id: applications.id,
  updatedAt: applications.updatedAt,
};

const DEFAULT_SORT = ["updatedAt", "DESC"];
const DEFAULT_RANGE = [0, 9];

const searchParams = (request: NextRequest): [number, number, SQL<unknown> | undefined, SQL<unknown>] => {
  const { searchParams } = new URL(request.url);

  const range = searchParams.get("range");
  const [rangeA, rangeB] = range ? JSON.parse(range) : DEFAULT_RANGE;

  const rangeLimit = rangeB - rangeA + 1;
  const rangeOffset = rangeA;

  const sort = searchParams.get("sort");
  const [sortA, sortB] = sort ? JSON.parse(sort) : DEFAULT_SORT;

  const sortOrderByFn = sortB === "ASC" ? asc : desc;
  const sortOrderBy = sortOrderByFn(FIELDS[sortA] || applications.updatedAt);

  const where = [];

  const filter = searchParams.get("filter");
  const filters = filter ? JSON.parse(filter) : {};
  if ('q' in filters) {
    where.push(ilike(applications.name,  `${filters.q}%`))
  }
  
  return [rangeLimit, rangeOffset, and(...where), sortOrderBy];
}

export const POST = async (request: NextRequest) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  
    const data = await request.json();

    const rows = await db
      .insert(applications)
      .values(data).returning({ id: applications.id });

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('[API][POST][Admin][apps][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
