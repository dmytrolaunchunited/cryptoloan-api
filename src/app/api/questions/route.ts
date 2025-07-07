import { NextResponse, NextRequest } from "next/server";
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../../db";
import { applications, scoringConditions, scoringFeatures, scoringFeaturesToScoringConditions, scoringQuestions, scoringQuestionsToScoringFeatures } from "../../../db/schema";

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Find questions
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - question
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

    const applicationRow = applicationRows[0];
    const applicationId = applicationRow.id;

    const scoringQuestionRows = await db
      .select({
        scoringFeatures: sql`
          (
            SELECT json_agg(${scoringQuestionsToScoringFeatures.scoringFeatureId})
            FROM ${scoringQuestionsToScoringFeatures}
            WHERE ${scoringQuestionsToScoringFeatures.scoringQuestionId} = ${scoringQuestions.id}
          )
        `.as('scoringFeatures'),
      })
      .from(scoringQuestions)
      .where(and(
        eq(scoringQuestions.applicationId, applicationId),
        eq(scoringQuestions.isActive, true),
      ));

    const scoringFeatureIds = [
      ...new Set(scoringQuestionRows.map(({ scoringFeatures }) => scoringFeatures).flat())
    ] as unknown as number[];

    const scoringFeatureRows = await db
      .select({
        id: scoringFeatures.id,
        name: scoringFeatures.name,
        scoringConditions: sql`
          (
            SELECT json_agg(${scoringFeaturesToScoringConditions.scoringConditionId})
            FROM ${scoringFeaturesToScoringConditions}
            WHERE ${scoringFeaturesToScoringConditions.scoringFeatureId} = ${scoringFeatures.id}
          )
        `.as('scoringConditions'),
      })
      .from(scoringFeatures)
      .where(and(
        inArray(scoringFeatures.id, scoringFeatureIds),
        eq(scoringFeatures.isActive, true),
      ));

    const scoringConditionIds = [
      ...new Set(scoringFeatureRows.map(({ scoringConditions }) => scoringConditions).flat())
    ] as unknown as number[];

    const scoringConditionRows = await db
      .select({
        id: scoringConditions.id,
        label: scoringConditions.label,
      })
      .from(scoringConditions)
      .where(and(
        inArray(scoringConditions.id, scoringConditionIds),
        eq(scoringConditions.isActive, true),
        isNull(scoringConditions.relation),
      ));

    const rows = scoringQuestionRows.map(({ scoringFeatures }: any) => {
      return scoringFeatureRows.filter((i) => scoringFeatures.includes(i.id)).map(({ id, name, scoringConditions }: any) => {
        const options = scoringConditionRows.filter(({ id }) => scoringConditions.includes(id));
        return { id, name, options };
      });
    });

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('[API][GET][questions][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}