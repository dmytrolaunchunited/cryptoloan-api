import { db } from "../../../../db";
import { applications, profiles, users } from "../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";

/**
 * @swagger
 * /api/users/:id:
 *   get:
 *     summary: Find user
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
export const GET = async (request: NextRequest, { params }: any) => {
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

    const id = Number(params.id);
    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.applicationId, applicationId)))
      .leftJoin(applications, eq(applications.id, users.applicationId))
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
