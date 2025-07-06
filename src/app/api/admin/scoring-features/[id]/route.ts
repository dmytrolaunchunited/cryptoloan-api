import { db } from "../../../../../db";
import { scoringFeatures, scoringFeaturesToScoringConditions } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, inArray, sql } from "drizzle-orm";

/**
 * @swagger
 * /api/admin/scoring-features/{id}:
 *   get:
 *     summary: Find scoring feature
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
export const GET = async (request: NextRequest, context: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);

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
      .where(eq(scoringFeatures.id, id))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][Admin][scoring-features][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}


/**
 * @swagger
 * /api/admin/scoring-features/{id}:
 *   delete:
 *     summary: Delete scoring feature
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
export const DELETE = async (request: NextRequest, context: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);

    const rows = await db
      .delete(scoringFeatures)
      .where(eq(scoringFeatures.id, id))
      .returning({ id: scoringFeatures.id });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][DELETE][Admin][scoring-features][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/scoring-features/{id}:
 *   put:
 *     summary: Update scoring feature
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
export const PUT = async (request: NextRequest, context: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);

    const data = await request.json();

    const rows = await db
      .update(scoringFeatures)
      .set(data)
      .where(eq(scoringFeatures.id, id))
      .returning({ id: scoringFeatures.id });

    const row = rows[0];
    const scoringFeatureId = row.id;

    const relationRows = await db
      .select()
      .from(scoringFeaturesToScoringConditions)
      .where(eq(scoringFeaturesToScoringConditions.scoringFeatureId, scoringFeatureId));

    const scoringConditionIds = new Set<number>(relationRows.map((i) => i.scoringConditionId));
    const ids = new Set<number>(data.scoringConditions);
    
    const idsDelete = [...scoringConditionIds].filter((i) => !ids.has(i));
    const idsCreate = [...ids].filter((i) => !scoringConditionIds.has(i));

    if (idsDelete.length) {
      await db
        .delete(scoringFeaturesToScoringConditions)
        .where(inArray(scoringFeaturesToScoringConditions.scoringConditionId, idsDelete))
    }
    if (idsCreate.length) {
      const values = idsCreate.map((scoringConditionId) => ({ scoringConditionId, scoringFeatureId }))
      await db
        .insert(scoringFeaturesToScoringConditions)
        .values(values);
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][PUT][Admin][scoring-features][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
