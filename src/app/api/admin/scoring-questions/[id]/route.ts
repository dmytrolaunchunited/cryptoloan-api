import { db } from "../../../../../db";
import { applications, scoringQuestions, scoringQuestionsToScoringFeatures } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, inArray, sql } from "drizzle-orm";

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
        id: scoringQuestions.id,
        name: scoringQuestions.name,
        description: scoringQuestions.description,
        isActive: scoringQuestions.isActive,
        createdAt: scoringQuestions.createdAt,
        updatedAt: scoringQuestions.updatedAt,
        applicationId: scoringQuestions.applicationId,
        application: sql`
          (
            SELECT row_to_json(${applications})
            FROM ${applications}
            WHERE ${applications.id} = ${scoringQuestions.applicationId}
          )
        `.as('application'),
        scoringFeatures: sql`
          (
            SELECT json_agg(${scoringQuestionsToScoringFeatures.scoringFeatureId})
            FROM ${scoringQuestionsToScoringFeatures}
            WHERE ${scoringQuestionsToScoringFeatures.scoringQuestionId} = ${scoringQuestions.id}
          )
        `.as('scoringFeatures'),
      })
      .from(scoringQuestions)
      .where(eq(scoringQuestions.id, id))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][Admin][scoring-questions][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

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
      .delete(scoringQuestions)
      .where(eq(scoringQuestions.id, id))
      .returning({ id: scoringQuestions.id });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][DELETE][Admin][scoring-questions][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

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
      .update(scoringQuestions)
      .set(data)
      .where(eq(scoringQuestions.id, id))
      .returning({ id: scoringQuestions.id });

    const row = rows[0];
    const scoringQuestionId = row.id;

    const relationRows = await db
      .select()
      .from(scoringQuestionsToScoringFeatures)
      .where(eq(scoringQuestionsToScoringFeatures.scoringQuestionId, scoringQuestionId));

    const scoringFeatureIds = new Set<number>(relationRows.map((i) => i.scoringFeatureId));
    const ids = new Set<number>(data.scoringFeatures);
    
    const idsDelete = [...scoringFeatureIds].filter((i) => !ids.has(i));
    const idsCreate = [...ids].filter((i) => !scoringFeatureIds.has(i));

    if (idsDelete.length) {
      await db
        .delete(scoringQuestionsToScoringFeatures)
        .where(inArray(scoringQuestionsToScoringFeatures.scoringFeatureId, idsDelete))
    }
    if (idsCreate.length) {
      const values = idsCreate.map((scoringFeatureId) => ({ scoringFeatureId, scoringQuestionId }))
      await db
        .insert(scoringQuestionsToScoringFeatures)
        .values(values);
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][PUT][Admin][scoring-questions][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
