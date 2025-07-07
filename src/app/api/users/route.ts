import { NextResponse, NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "../../../db";
import { applications, users } from "../../../db/schema";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Find privy user
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

    const applicationRow = applicationRows[0];
    const applicationId = applicationRow.id;

    const { searchParams } = new URL(request.url);

    const privy = searchParams.get("privy");

    const rows = await db
      .select()
      .from(users)
      .where(and(eq(users.privy, privy!), eq(users.applicationId, applicationId)))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Upsert privy user
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

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.privy, data.privy))
      .limit(1);
  
    if (userRows.length) {
      const rows = await db
        .update(users)
        .set(data)
        .where(and(eq(users.privy, data.privy), eq(users.applicationId, applicationId)))
        .returning({ id: users.id });

      return NextResponse.json(rows[0], { status: 200 });
    } else {
      const rows = await db
        .insert(users)
        .values({ ...data, applicationId })
        .returning({ id: users.id });

      return NextResponse.json(rows[0], { status: 200 });
    }
  } catch (error) {
    console.error('[API][POST][users]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
