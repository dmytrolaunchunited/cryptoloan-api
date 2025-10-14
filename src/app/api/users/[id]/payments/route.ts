import { db } from "@/db";
import { applications, userLoans, userPayments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, sql, and } from "drizzle-orm";
import { JsonRpcProvider, Contract, Wallet, parseUnits } from 'ethers';

/**
 * @swagger
 * /api/users/{id}/payments:
 *   get:
 *     summary: Retrieve payments for a specific user
 *     description: Returns a paginated list of payments made by the user with the specified ID.
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user's unique identifier.
 *         example: 123
 *       - in: query
 *         name: take
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of records to return.
 *         example: 10
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of records to skip (for pagination).
 *         example: 0
 *     responses:
 *       200:
 *         description: A paginated list of user payments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Payment ID
 *                       userId:
 *                         type: integer
 *                         description: User ID
 *                       amount:
 *                         type: number
 *                         format: float
 *                         description: Payment amount
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Payment creation timestamp
 *                 total:
 *                   type: integer
 *                   description: Total number of payments for the user
 *             example:
 *               rows:
 *                 - id: 1
 *                   userId: 123
 *                   amount: 100.5
 *                   createdAt: "2024-06-01T12:00:00Z"
 *               total: 1
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - missing or invalid API key
 *       403:
 *         description: Forbidden - API key not associated with any application
 */
export const GET = async (request: NextRequest, context: any) => {
  try {
    const apiKey = request.headers.get('X-API-KEY');
    if (!apiKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const applicationRows = await db
      .select()
      .from(applications)
      .where(eq(applications.uuid, apiKey))
      .limit(1);

    if (!applicationRows.length) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const status = request.nextUrl.searchParams.get('status');
    const take = request.nextUrl.searchParams.get('take');
    const skip = request.nextUrl.searchParams.get('skip');
    const params = await context.params;

    const id = Number(params.id);
    const rows = await db
      .select()
      .from(userPayments)
      .limit(Number(take))
      .offset(Number(skip))
      .where(status ? and(
        eq(userPayments.userId, id),
        eq(userPayments.status, status),
      ) : eq(userPayments.userId, id))

    const [countRows] = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(userPayments)
      .where(status ? and(
        eq(userPayments.userId, id),
        eq(userPayments.status, status),
      ) : eq(userPayments.userId, id));

    const total = countRows.total;

    return NextResponse.json({ rows, total }, { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id][payments]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
