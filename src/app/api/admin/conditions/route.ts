import { NextResponse, NextRequest } from "next/server";
import { count, desc } from "drizzle-orm";
import { db } from "../../../../db";
import { conditions } from "../../../../db/schema";

/**
 * @swagger
 * /api/admin/conditions:
 *   get:
 *     summary: Find conditions
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
 *         description: success
 */
export const GET = async (request: NextRequest) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
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
      .from(conditions)
      .orderBy(desc(conditions.createdAt))
      .groupBy(conditions.id, conditions.createdAt)
      .limit(limit)
      .offset(offset);

    const rowsCount = await db
      .select({ count: count() })
      .from(conditions);

    const totalCount = rowsCount[0].count.toString();
    const contentRange = `conditions ${offset}-${limit - 1}/${totalCount}`
    const response = NextResponse.json(rows, { status: 200 });
      
    response.headers.set('Content-Range', contentRange);
    response.headers.set('X-Total-Count', totalCount);
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');

    return response;
  } catch (error) {
    console.error('[API][GET][Admin][conditions]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}