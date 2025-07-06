import { NextRequest, NextResponse } from "next/server";
import { count, desc, asc, SQL, eq, sql } from "drizzle-orm";
import { applications, profiles, users } from "../../../../db/schema";
import { db } from "../../../../db";
import { PgColumn } from "drizzle-orm/pg-core";

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Find users
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

    const [limit, offset, orderBy] = searchParams(request);

    const rows = await db
      .select({
        id: users.id,
        privy: users.privy,
        phone: users.phone,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        application: sql`
          (
            SELECT row_to_json(applications)
            FROM applications
            WHERE applications.id = ${users.applicationId}
          )
        `.as('application'),
      })
      .from(users)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const rowsCount = await db
      .select({ count: count() })
      .from(users);

    const totalCount = rowsCount[0].count.toString();
    const contentRange = `users ${offset}-${limit - 1}/${totalCount}`
    const response = NextResponse.json(rows, { status: 200 });
      
    response.headers.set('Content-Range', contentRange);
    response.headers.set('X-Total-Count', totalCount);
    response.headers.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');

    return response;
  } catch (error) {
    console.error('[API][GET][Admin][users]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

const FIELDS: Record<any, PgColumn<any>> = {
  id: users.id,
  updatedAt: users.updatedAt,
};

const DEFAULT_SORT = ["updatedAt", "DESC"];
const DEFAULT_RANGE = [0, 9];

const searchParams = (request: NextRequest): [number, number, SQL<unknown>] => {
  const { searchParams } = new URL(request.url);

  const range = searchParams.get("range");
  const [rangeA, rangeB] = range ? JSON.parse(range) : DEFAULT_RANGE;

  const rangeLimit = rangeB - rangeA + 1;
  const rangeOffset = rangeA;

  const sort = searchParams.get("sort");
  const [sortA, sortB] = sort ? JSON.parse(sort) : DEFAULT_SORT;

  const sortOrderByFn = sortB === "ASC" ? asc : desc;
  const sortOrderBy = sortOrderByFn(FIELDS[sortA] || users.updatedAt);

  return [rangeLimit, rangeOffset, sortOrderBy];
}
