import { db } from "../../../../../db";
import { applications, userDevices } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/users/{id}/device:
 *   post:
 *     summary: Upsert user device
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
      .from(userDevices)
      .where(eq(userDevices.userId, userId))
      .limit(1);
  
    if (userProfileRows.length) {
     const rows = await db
        .update(userDevices)
        .set(data)
        .where(eq(userDevices.userId, userId))
        .returning({ id: userDevices.id });
      
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      const rows = await db
        .insert(userDevices)
        .values({ ...data, userId })
        .returning({ id: userDevices.id });
    
      return NextResponse.json(rows[0], { status: 200 });
    }
  } catch (error) {
    console.error('[API][POST][users][:id][device]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
