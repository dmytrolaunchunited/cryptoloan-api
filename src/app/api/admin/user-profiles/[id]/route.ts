import { db } from "../../../../../db";
import { userProfiles } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/admin/user-profiles/{id}:
 *   get:
 *     summary: Find user profile
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
export const GET = async (request: NextRequest, context: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);

    const rows = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, id))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][Admin][user-profiles][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/user-profiles/{id}:
 *   delete:
 *     summary: Delete user profile
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
export const DELETE = async (request: NextRequest, context: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);

    const rows = await db
      .delete(userProfiles)
      .where(eq(userProfiles.id, id))
      .returning({ id: userProfiles.id });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][DELETE][Admin][user-profiles[:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/user-profiles/{id}:
 *   put:
 *     summary: Update user profile
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
export const PUT = async (request: NextRequest, context: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const params = await context.params;
    const id = Number(params.id);

    const data = await request.json();

    const rows = await db
      .update(userProfiles)
      .set(data)
      .where(eq(userProfiles.id, id))
      .returning({ id: userProfiles.id });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][PUT][Admin][user-profiles][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
