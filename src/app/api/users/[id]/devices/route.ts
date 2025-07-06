import { db } from "../../../../../db";
import { applications, userDevices } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";

/**
 * @swagger
 * /api/users/{id}/devices:
 *   post:
 *     summary: Create user device
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - user
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             ipAddress: '192.168.1.1'
 *             firstName: 'Test'
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

    const rows = await db
      .select()
      .from(userDevices)
      .where(and(
        eq(userDevices.userId, userId),
        eq(userDevices.model, data.model),
        eq(userDevices.ipAddress, data.ipAddress),
      ))
      .limit(1);
  
    if (!rows.length) {
      await db
        .insert(userDevices)
        .values({ ...data, userId });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[API][POST][users][:id][devices]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
