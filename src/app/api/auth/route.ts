import { NextResponse, NextRequest } from "next/server";
import { eq, and, like } from "drizzle-orm";
import { db } from "../../../db";
import { applications, users } from "../../../db/schema";

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Auth
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - auth
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
export const POST = async (request: NextRequest) => {
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

    const data = await request.json();
    const { authData, authProvider } = data;
    const authDataJson = JSON.parse(authData || '{}');

    const rows = await db
      .select()
      .from(users)
      .where(and(
        like(users.authData, `%${authDataJson.id!}%`),
        eq(users.authProvider, authProvider!),
        eq(users.applicationId, applicationId),
      ))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][PATCH][users][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
