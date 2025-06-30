import { NextRequest, NextResponse } from "next/server";
import { count, desc } from "drizzle-orm";
import { applications } from "../../../../db/schema";
import { db } from "../../../../db";

/**
 * @swagger
 * /api/admin/applications:
 *   get:
 *     summary: Find applications
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - admin
 *     parameters:
 *       - in: query
 *         type: integer
 *         name: limit
 *         description: The limit of find records 
 *       - in: query
 *         type: integer
 *         name: offset
 *         description: The offset of find records 
 *     responses:
 *       400:
 *         description: bad request
 *       403:
 *         description: forbidden
 *       401:
 *         description: unauthorized
 *       200:
 *         description: success operation
 */
export const GET = async (request: NextRequest) => {
  try {
    const secretKey = request.headers.get('X-SECRET-KEY');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const limit = Number(request.nextUrl.searchParams.get('limit') || 20);
    const offset = Number(request.nextUrl.searchParams.get('offset') || 0);

    const rows = await db
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .groupBy(applications.id, applications.createdAt)
      .limit(limit)
      .offset(offset);

    const rowsCount = await db
      .select({ count: count() })
      .from(applications);

    return NextResponse.json({ ...rowsCount[0], rows }, { status: 200 });
  } catch (error) {
    console.error('[API][GET][Admin][applications]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}