import { NextResponse, NextRequest } from "next/server";

/**
 * @swagger
 * /api/users/:id:
 *   get:
 *     summary: Find user
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - user
 *     responses:
 *       403:
 *         description: forbidden operation
 *       401:
 *         description: unauthorized operation
 *       200:
 *         description: success operation
 */
export const GET = (request: NextRequest) => {
  // TODO...
  return NextResponse.json({});
}
