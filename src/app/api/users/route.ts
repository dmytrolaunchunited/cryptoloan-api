import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
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
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             privy: cmcch0i1t01cel50nj19qd2eo
 *     responses:
 *       400:
 *         description: bad request
 *       403:
 *         description: forbidden
 *       401:
 *         description: unauthorized
 *       204:
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

    const data = await request.json();

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.privy, data.privy))
      .limit(1);
  
    if (rows.length) {
      await db
        .update(users)
        .set(data)
        .where(eq(users.privy, data.privy));
    } else {
      const applicationRow = applicationRows[0];
      const applicationId = applicationRow.id;
      await db
        .insert(users)
        .values({ ...data, applicationId });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[API][POST][users]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
