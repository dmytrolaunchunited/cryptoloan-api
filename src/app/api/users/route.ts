import { NextResponse, NextRequest } from "next/server";
import { eq, count, desc } from "drizzle-orm";
import { db } from "../../../db";
import { users } from "../../../db/schema";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Find users
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - user
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
 *       403:
 *         description: forbidden operation
 *       401:
 *         description: unauthorized operation
 *       200:
 *         description: success operation
 */
export const GET = async (request: NextRequest) => {
  const apiKey = request.headers.get('X-API-KEY');
  if (!apiKey) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (apiKey !== process.env.API_KEY) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const limit = Number(request.nextUrl.searchParams.get('limit') || 20);
  const offset = Number(request.nextUrl.searchParams.get('offset') || 0);

  const rows = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt))
    .groupBy(users.id, users.createdAt)
    .limit(limit)
    .offset(offset);

  const rowsCount = await db
    .select({ count: count() })
    .from(users);

  return NextResponse.json(
    { ...rowsCount[0], rows },
    { status: 200 },
  );
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Upsert user
 *     security:
 *       - ApiName: []
 *       - ApiUUID: []
 *     tags:
 *       - user
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             privy: cmcch0i1t01cel50nj19qd2eo
 *     responses:
 *       403:
 *         description: forbidden operation
 *       401:
 *         description: unauthorized operation
 *       204:
 *         description: success operation
 */
export const POST = async (request: NextRequest) => {
  const apiKey = request.headers.get('X-API-KEY');
  if (!apiKey) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  if (apiKey !== process.env.API_KEY) {
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
    await db
      .insert(users)
      .values({ ...data });
  }
  return NextResponse.json(
    null,
    { status: 204 },
  );
}
