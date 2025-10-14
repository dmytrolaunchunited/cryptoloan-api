import { NextResponse, NextRequest } from "next/server";
import { eq, and, like } from "drizzle-orm";
import { db } from "../../../db";
import { applications, users } from "../../../db/schema";

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Upsert user
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
    const { authProvider, authData } = data;
    const authDataJson = JSON.parse(authData || '{}');

    const userRows = await db
      .select()
      .from(users)
      .where(and(
        like(users.authData, `%${authDataJson.id}%`),
        eq(users.authProvider, authProvider),
        eq(users.applicationId, applicationId),
      ))
      .limit(1);
  
    if (userRows.length) {
      const rows = await db
        .update(users)
        .set({
          authData: authData,
          email: authDataJson.email,
          phone: authDataJson.phone
        })
        .where(and(
          like(users.authData, `%${authDataJson.id}%`),
          eq(users.authProvider, authProvider),
          eq(users.applicationId, applicationId),
        ))
        .returning({ id: users.id });

      return NextResponse.json(rows[0], { status: 200 });
    } else {
      const rows = await db
        .insert(users)
        .values({
          authData,
          authProvider,
          applicationId,
          email: authDataJson.email,
          phone: authDataJson.phone,
        })
        .returning({ id: users.id });

      return NextResponse.json(rows[0], { status: 200 });
    }
  } catch (error) {
    console.error('[API][POST][users]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
