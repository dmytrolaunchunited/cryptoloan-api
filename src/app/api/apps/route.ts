import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { applications } from "../../../db/schema";

/**
 * @swagger
 * /api/apps:
 *   get:
 *     summary: Application
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - application
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
export const GET = async (request: NextRequest) => {
  try {
    const apiKey = request.headers.get('X-API-KEY');
    if (!apiKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.uuid, apiKey))
      .limit(1);

    if (!rows.length) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][apps]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}