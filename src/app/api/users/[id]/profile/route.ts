import { db } from "../../../../../db";
import { applications, scoringConditions, scoringFeatures, scoringFeaturesToScoringConditions, scoringPayouts, userFeatures, userLoans, userProfiles, users } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, sql, and, isNotNull } from "drizzle-orm";

/**
 * @swagger
 * /api/users/{id}/profile:
 *   get:
 *     summary: Find user profile
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - user
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
export const GET = async (request: NextRequest, context: any) => {
  try {
    const apiKey = request.headers.get('X-API-KEY');
    if (!apiKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const applicationRows = await db
      .select()
      .from(applications)
      .where(eq(applications.uuid, apiKey))
      .limit(1);

    if (!applicationRows.length) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const userId = Number(params.id);
  
    const rows = await db
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
        loanTotal: sql`
          COALESCE(
            (SELECT SUM(ul.total)
            FROM ${userLoans} ul
            WHERE ul.user_id = ${users.id} AND ul.status = 'approved'), 
            0
          )
        `.as('loanTotal'),

        loanTotalAmount: sql`
          COALESCE(
            (SELECT SUM(ul.amount)
            FROM ${userLoans} ul
            WHERE ul.user_id = ${users.id} AND ul.status = 'approved'), 
            0
          )
        `.as('loanTotalAmount'),
        // loanTotalAmount: sql`COALESCE(SUM(${userLoans.amount}), 0)`.mapWith(val => Number(val) || 0),
      })
      .from(userProfiles)
      .leftJoin(users, eq(users.id, userProfiles.userId))
      .leftJoin(applications, eq(applications.id, users.applicationId))
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (rows[0]) {
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

      const row = rows[0]! as any;

      let scoreStatus = 'invite';
      let scorePayout = 0;
      let score = 0;

      if (row.userFeatures) {
        for (let q = 0; q < row.userFeatures.length; q++) {
          if (row.userFeatures[q].scoringFeature.type === 'social') {
            score += Number(row.userFeatures[q].scoringCondition.value);
          }
          if (row.userFeatures[q].scoringFeature.type === 'behavioral') {
            score -= Number(row.userFeatures[q].scoringCondition.value);
          }
        }

        for (let q = 0; q < scoringFeatureRows.length; q++) {
          if (row.application.id === scoringFeatureRows[q].scoringFeature?.applicationId) {
            if (scoringFeatureRows[q].scoringCondition?.relation === 'dateOfBirth') {
              const age = Number(row.age);
            
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
          if (row.application?.id === scoringPayoutRows[q].applicationId) {
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

      const min = Number(row.application?.scoreValidationMin);
      const max = Number(row.application?.scoreValidationMax);
      if (score < min) {
        scoreStatus = 'reject';
      }
      if (score >= min && score < max) {
        scoreStatus = 'review';
      }
      if (score >= max) {
        scoreStatus = 'accept';
      }

      return NextResponse.json({
        id: row.id,
        userId: row.userId,
        loanTotal: row.loanTotal,
        loanTotalAmount: row.loanTotalAmount,
        score,
        scoreStatus,
        scorePayout,
      }, { status: 200 });
    }
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id][profile]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/users/{id}/profile:
 *   post:
 *     summary: Upsert user profile
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - user
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             ipAddress: '192.168.1.1'
 *             email: 'test@gmail.com'
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
export const POST = async (request: NextRequest, context: any) => {
  try {
    const apiKey = request.headers.get('X-API-KEY');
    if (!apiKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const applicationRows = await db
      .select()
      .from(applications)
      .where(eq(applications.uuid, apiKey))
      .limit(1);

    if (!applicationRows.length) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const userId = params.id;

    const data = await request.json();

    const userProfileRows = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
  
    if (userProfileRows.length) {
     const rows = await db
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.userId, userId))
        .returning({ id: userProfiles.id });
      
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      const rows = await db
        .insert(userProfiles)
        .values({ ...data, userId })
        .returning({ id: userProfiles.id });
    
      return NextResponse.json(rows[0], { status: 200 });
    }
  } catch (error) {
    console.error('[API][POST][users][:id][profile]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
