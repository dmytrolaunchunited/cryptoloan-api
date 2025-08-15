import { NextRequest, NextResponse } from "next/server";
import { count, desc, asc, SQL, and, eq, isNotNull, sql } from "drizzle-orm";
import { applications, scoringConditions, scoringFeatures, scoringFeaturesToScoringConditions, scoringPayouts, userFeatures, userProfiles, users } from "../../../../db/schema";
import { db } from "../../../../db";
import { PgColumn } from "drizzle-orm/pg-core";

/**
 * @swagger
 * /api/admin/user-profiles:
 *   get:
 *     summary: Find user profiles
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

    const userProfileRows = await db
      .select({
        id: userProfiles.id,
        userId: userProfiles.userId,
        dateOfBirth: userProfiles.dateOfBirth,
        citizenshipCountry: userProfiles.citizenshipCountry,
        residenceCountry: userProfiles.residenceCountry,
        createdAt: userProfiles.createdAt,
        updatedAt: userProfiles.updatedAt,
        user: users,
        application: applications,
        userFeatures: sql`
          (
            SELECT json_agg(
              json_build_object(
                'userFeature', uf.*,
                'scoringFeature', sf.*,
                'scoringCondition', sc.*
              )
            )
            FROM ${userFeatures} uf
            LEFT JOIN ${scoringFeatures} sf ON sf.id = uf.scoring_feature_id
            LEFT JOIN ${scoringConditions} sc ON sc.id = uf.scoring_condition_id
            WHERE uf.user_id = ${users.id}
          )
        `.as('userFeatures'),
        age: sql`EXTRACT(YEAR FROM age(${userProfiles.dateOfBirth}))`.as('age'),
      })
      .from(userProfiles)
      .leftJoin(users, eq(users.id, userProfiles.userId))
      .leftJoin(applications, eq(applications.id, users.applicationId))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const scoringFeatureRows = await db
      .select({
        scoringFeature: scoringFeatures,
        scoringCondition: scoringConditions,
      })
      .from(scoringFeatures)
      .leftJoin(scoringFeaturesToScoringConditions, eq(scoringFeaturesToScoringConditions.scoringFeatureId, scoringFeatures.id))
      .leftJoin(scoringConditions, eq(scoringConditions.id, scoringFeaturesToScoringConditions.scoringConditionId))
      .where(and(
        isNotNull(scoringConditions.relation),
        eq(scoringFeatures.isActive, true),
        eq(scoringConditions.isActive, true),
      ));

    const scoringPayoutRows = await db
      .select()
      .from(scoringPayouts)
      .where(eq(scoringPayouts.isActive, true));

    const rows = userProfileRows.map((i: any) => {
      let scoreStatus = 'invite';
      let scorePayout = 0;
      let score = 0;

      if (i.userFeatures) {
        for (let q = 0; q < i.userFeatures.length; q++) {
          if (i.userFeatures[q].scoringFeature.type === 'social') {
            score += Number(i.userFeatures[q].scoringCondition.value);
          }
          if (i.userFeatures[q].scoringFeature.type === 'behavioral') {
            score -= Number(i.userFeatures[q].scoringCondition.value);
          }
        }

        for (let q = 0; q < scoringFeatureRows.length; q++) {
          if (i.application.id === scoringFeatureRows[q].scoringFeature?.applicationId) {
            if (scoringFeatureRows[q].scoringCondition?.relation === 'dateOfBirth') {
              const age = Number(i.age);
            
              if (scoringFeatureRows[q].scoringCondition?.condition?.includes('-')) {
                const [min, max] = scoringFeatureRows[q].scoringCondition?.condition?.split('-')!;

                if (min && max) {
                  const minNumber = Number(min);
                  const maxNumber = Number(max);
                  if (age >= minNumber && maxNumber <= age) {
                    if (scoringFeatureRows[q].scoringFeature.type === 'social') {
                      score += Number(scoringFeatureRows[q].scoringCondition?.value);
                      continue;
                    }
                    if (scoringFeatureRows[q].scoringFeature.type === 'behavioral') {
                      score -= Number(scoringFeatureRows[q].scoringCondition?.value);
                      continue;
                    }
                  }
                }
                if (min && !max) {
                  const minNumber = Number(min);
                  if (age <= minNumber) {
                    if (scoringFeatureRows[q].scoringFeature.type === 'social') {
                      score += Number(scoringFeatureRows[q].scoringCondition?.value);
                      continue;
                    }
                    if (scoringFeatureRows[q].scoringFeature.type === 'behavioral') {
                      score -= Number(scoringFeatureRows[q].scoringCondition?.value);
                      continue;
                    }
                  }
                }
              } 
              if (scoringFeatureRows[q].scoringCondition?.condition?.includes('+')) {
                const [min] = scoringFeatureRows[q].scoringCondition?.condition?.split('+')!;
                const minNumber = Number(min);
                if (age >= minNumber) {
                  if (scoringFeatureRows[q].scoringFeature.type === 'social') {
                    score += Number(scoringFeatureRows[q].scoringCondition?.value);
                    continue;
                  }
                  if (scoringFeatureRows[q].scoringFeature.type === 'behavioral') {
                    score -= Number(scoringFeatureRows[q].scoringCondition?.value);
                    continue;
                  }
                }
              }
  
              if (scoringFeatureRows[q].scoringFeature.type === 'social') {
                score += Number(scoringFeatureRows[q].scoringCondition?.value);
                continue;
              }
              if (scoringFeatureRows[q].scoringFeature.type === 'behavioral') {
                score -= Number(scoringFeatureRows[q].scoringCondition?.value);
                continue;
              }
            }
          }
        }

        for (let q = 0; q < scoringPayoutRows.length; q++) {
          if (i.application.id === scoringPayoutRows[q].applicationId) {
            if (scoringPayoutRows[q].condition?.includes('-')) {
              const [min, max] = scoringPayoutRows[q].condition?.split('-')!;

              if (min && max) {
                const minNumber = Number(min);
                const maxNumber = Number(max);
                if (score >= minNumber && maxNumber <= score) {
                  scorePayout = Number(scoringPayoutRows[q].value);
                  continue;
                }
              }
              if (min && !max) {
                const minNumber = Number(min);
                if (score <= minNumber) {
                  scorePayout = Number(scoringPayoutRows[q].value);
                  continue;
                }
              }
            }
            if (scoringPayoutRows[q].condition?.includes('+')) {
              const [min] = scoringPayoutRows[q].condition?.split('+')!;
              const minNumber = Number(min);
              if (score >= minNumber) {
                scorePayout = Number(scoringPayoutRows[q].value);
                continue;
              }
            }
          }
        }
      }

      const min = Number(i.application.scoreValidationMin);
      const max = Number(i.application.scoreValidationMax);
      if (score < min) {
        scoreStatus = 'reject';
      }
      if (score >= min && score < max) {
        scoreStatus = 'review';
      }
      if (score >= max) {
        scoreStatus = 'accept';
      }
      //verify
      return {
        id: i.id,
        userId: i.userId,
        dateOfBirth: i.dateOfBirth,
        citizenshipCountry: i.citizenshipCountry,
        residenceCountry: i.residenceCountry,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        score,
        scoreStatus,
        scorePayout,
      };
    });

    const rowsCount = await db
      .select({ count: count() })
      .from(userProfiles)
      .where(where);

    const totalCount = rowsCount[0].count.toString();
    const contentRange = `user-profiles ${offset}-${limit - 1}/${totalCount}`
    const response = NextResponse.json(rows, { status: 200 });
      
    response.headers.set('Content-Range', contentRange);
    response.headers.set('X-Total-Count', totalCount);
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');

    return response;
  } catch (error) {
    console.error('[API][GET][Admin][user-profiles]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

const FIELDS: Record<any, PgColumn<any>> = {
  id: userProfiles.id,
  updatedAt: userProfiles.updatedAt,
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
  const sortOrderBy = sortOrderByFn(FIELDS[sortA] || userProfiles.updatedAt);

  const where = [];

  const filter = searchParams.get("filter");
  const filters = filter ? JSON.parse(filter) : {};

  if ('userId' in filters) {
    where.push(eq(userProfiles.userId, filters.userId));
  }
  
  return [rangeLimit, rangeOffset, and(...where), sortOrderBy];
}