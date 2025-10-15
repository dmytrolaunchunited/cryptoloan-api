import { db } from "../../../../../db";
import { applications } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/admin/apps/{id}:
 *   get:
 *     summary: Find user
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
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][Admin][apps][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/apps/{id}:
 *   delete:
 *     summary: Delete application
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
      .delete(applications)
      .where(eq(applications.id, id))
      .returning({ id: applications.id });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][DELETE][Admin][apps[:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

/**
 * @swagger
 * /api/admin/apps/{id}:
 *   put:
 *     summary: Update application
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
      .update(applications)
      .set(data)
      .where(eq(applications.id, id))
      .returning({ id: applications.id });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][PUT][Admin][apps][:id]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
