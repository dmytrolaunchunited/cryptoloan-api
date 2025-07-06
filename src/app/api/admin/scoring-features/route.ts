import { NextRequest, NextResponse } from "next/server";
import { count, desc,asc, SQL, and, ilike, sql } from "drizzle-orm";
import { PgColumn } from "drizzle-orm/pg-core";
import { scoringFeaturesToScoringConditions, scoringFeatures } from "../../../../db/schema";
import { db } from "../../../../db";

/**
 * @swagger
 * /api/admin/scoring-features:
 *   get:
 *     summary: Find scoring features
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - admin
 *     responses:
 *       400:
 *         description: bad request
 *       403:
 *         description: forbidden
 *       401:
 *         description: unauthorized
 *       200:
 *         description: success
 */
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
      .select({
        id: scoringFeatures.id,
        name: scoringFeatures.name,
        type: scoringFeatures.type,
        description: scoringFeatures.description,
        isActive: scoringFeatures.isActive,
        createdAt: scoringFeatures.createdAt,
        updatedAt: scoringFeatures.updatedAt,
        scoringConditions: sql`
          (
            SELECT json_agg(${scoringFeaturesToScoringConditions.scoringConditionId})
            FROM ${scoringFeaturesToScoringConditions}
            WHERE ${scoringFeaturesToScoringConditions.scoringFeatureId} = ${scoringFeatures.id}
          )
        `.as('scoringConditions'),
      })
      .from(scoringFeatures)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const rowsCount = await db
      .select({ count: count() })
      .from(scoringFeatures)
      .where(where);

    const totalCount = rowsCount[0].count.toString();
    const contentRange = `scoring-features ${offset}-${limit - 1}/${totalCount}`
    const response = NextResponse.json(rows, { status: 200 });
      
    response.headers.set('Content-Range', contentRange);
    response.headers.set('X-Total-Count', totalCount);
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');

    return response;
  } catch (error) {
    console.error('[API][GET][Admin][scoring-features]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

const FIELDS: Record<any, PgColumn<any>> = {
  id: scoringFeatures.id,
  updatedAt: scoringFeatures.updatedAt,
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
  const sortOrderBy = sortOrderByFn(FIELDS[sortA] || scoringFeatures.updatedAt);

  const where = [];

  const filter = searchParams.get("filter");
  const filters = filter ? JSON.parse(filter) : {};
  if ('q' in filters) {
    where.push(ilike(scoringFeatures.name,  `${filters.q}%`))
  }
  
  return [rangeLimit, rangeOffset, and(...where), sortOrderBy];
}

/**
 * @swagger
 * /api/admin/scoring-features:
 *   post:
 *     summary: Create scoring feature
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - admin
 *     responses:
 *       400:
 *         description: bad request
 *       403:
 *         description: forbidden
 *       401:
 *         description: unauthorized
 *       201:
 *         description: success
 */
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
      .insert(scoringFeatures)
      .values(data).returning({ id: scoringFeatures.id });
      
    const row = rows[0];
    const scoringFeatureId = row.id;

    const dataRelations = data.scoringConditions.map((scoringConditionId: number) => ({
      scoringConditionId,
      scoringFeatureId,
    }));

    await db
      .insert(scoringFeaturesToScoringConditions)
      .values(dataRelations);

    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error('[API][POST][Admin][scoring-features][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
