import { db } from "../../../../../db";
import { applications } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/admin/applications/:id:
 *   get:
 *     summary: Find user
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - admin
 *     responses:
 *       403:
 *         description: forbidden operation
 *       401:
 *         description: unauthorized operation
 *       200:
 *         description: success operation
 */
export const GET = async (request: NextRequest, { params }: any) => {
  try {
    const secretKey = request.headers.get('X-Secret-Key');
    if (!secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    const id = Number(params.id);
    const rows = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][Admin][applications]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
