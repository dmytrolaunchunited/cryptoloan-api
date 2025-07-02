import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/admin/auth:
 *   post:
 *     summary: Authenticate admin
 *     tags:
 *       - admin
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             secretKey: ...
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
    const data = await request.json();

    if (!data.secretKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (data.secretKey !== process.env.SECRET_KEY) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('[API][POST][Admin][auth]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
