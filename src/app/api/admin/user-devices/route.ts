import { NextRequest, NextResponse } from "next/server";
import { count, desc, asc, SQL, ilike, and, or, eq } from "drizzle-orm";
import { userDevices } from "../../../../db/schema";
import { db } from "../../../../db";
import { PgColumn } from "drizzle-orm/pg-core";

/**
 * @swagger
 * /api/admin/user-devices:
 *   get:
 *     summary: Find user devices
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - admin
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

    const [limit, offset, where, orderBy] = searchParams(request);

    const rows = await db
      .select()
      .from(userDevices)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const rowsCount = await db
      .select({ count: count() })
      .from(userDevices)
      .where(where);

    const totalCount = rowsCount[0].count.toString();
    const contentRange = `user-devices ${offset}-${limit - 1}/${totalCount}`
    const response = NextResponse.json(rows, { status: 200 });
      
    response.headers.set('Content-Range', contentRange);
    response.headers.set('X-Total-Count', totalCount);
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');

    return response;
  } catch (error) {
    console.error('[API][GET][Admin][user-devices]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

const FIELDS: Record<any, PgColumn<any>> = {
  id: userDevices.id,
  createdAt: userDevices.createdAt,
};

const DEFAULT_SORT = ["createdAt", "DESC"];
const DEFAULT_RANGE = [0, 9];

const searchParams = (request: NextRequest): [number, number, SQL<unknown> | undefined, SQL<unknown>] => {
  const { searchParams } = new URL(request.url);

  const range = searchParams.get("range");
  const [rangeA, rangeB] = range ? JSON.parse(range) : DEFAULT_RANGE;

  const rangeLimit = rangeB - rangeA + 1;
  const rangeOffset = rangeA;

  const sort = searchParams.get("sort");
  const [sortA, sortB] = sort ? JSON.parse(sort) : DEFAULT_SORT;

  const sortOrderByFn = sortB === "ASC" ? asc : desc;
  const sortOrderBy = sortOrderByFn(FIELDS[sortA] || userDevices.createdAt);

  const where = [];

  const filter = searchParams.get("filter");
  const filters = filter ? JSON.parse(filter) : {};

  if ('userId' in filters) {
    where.push(eq(userDevices.userId, filters.userId));
  }
  if ('q' in filters) {
    where.push(or(
      ilike(userDevices.model,  `${filters.q}%`),
      ilike(userDevices.name,  `${filters.q}%`),
    ));
  }
  
  return [rangeLimit, rangeOffset, and(...where), sortOrderBy];
}