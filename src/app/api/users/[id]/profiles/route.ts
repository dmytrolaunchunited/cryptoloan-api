import { db } from "../../../../../db";
import { applications, userProfiles } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";

/**
 * @swagger
 * /api/users/{id}/profiles:
 *   get:
 *     summary: Find user profile
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
      .from(userProfiles)
      .where(and(eq(userProfiles.userId, id)))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id][profiles]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/users/{id}/profiles:
 *   post:
 *     summary: Upsert user profile
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

    const userProfileRows = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);
  
    if (userProfileRows.length) {
     const rows = await db
        .update(userProfiles)
        .set(data)
        .where(eq(userProfiles.userId, userId))
        .returning({ id: userProfiles.id });
      
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      const rows = await db
        .insert(userProfiles)
        .values({ ...data, userId })
        .returning({ id: userProfiles.id });
    
      return NextResponse.json(rows[0], { status: 200 });
    }
  } catch (error) {
    console.error('[API][POST][users][:id][profiles]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
