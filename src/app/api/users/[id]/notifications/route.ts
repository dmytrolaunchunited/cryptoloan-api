import { db } from "../../../../../db";
import { applications, userNotifications } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/users/{id}/notifications:
 *   get:
 *     summary: Find user notifications
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
    const id = Number(params.id);
    const rows = await db
      .select()
      .from(userNotifications)
      .where(eq(userNotifications.userId, id))
      .limit(100)

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('[API][POST][users][:id][notifications]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
