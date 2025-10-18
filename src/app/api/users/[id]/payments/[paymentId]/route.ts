import { db } from "@/db";
import { applications, userPayments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { Mnemonic, HDNodeWallet } from "ethers";

/**
 * @swagger
 * /api/users/{id}/payment/{paymentId}:
 *   get:
 *     summary: Find user payment
 *     security:
 *       - ApiKeyAuth: []   
 *     tags:
 *       - user
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

    const params = await context.params;

    const id = Number(params.id);
    const paymentId = Number(params.paymentId);

    const rows = await db
      .select()
      .from(userPayments)
      .where(and(
        eq(userPayments.userId, id),
        eq(userPayments.id, paymentId),
      ))
      .limit(1);
    
    if (!rows[0].wallet) {
      const masterMnemonic = Mnemonic.fromPhrase(process.env.MASTER_MNEMONIC!);
      const master = HDNodeWallet.fromMnemonic(masterMnemonic);

      const walletChild = master.derivePath(`44'/60'/0'/0/${rows[0]?.id}`);
      const walletAddress = walletChild.address.toLowerCase();

      await db
        .update(userPayments)
        .set({ wallet: walletAddress })
        .where(
          and(
            eq(userPayments.userId, id),
            eq(userPayments.id, paymentId),
          )
        );
    }

    const userPaymentRows = await db
      .select()
      .from(userPayments)
      .where(and(
        eq(userPayments.userId, id),
        eq(userPayments.id, paymentId),
      ))
      .limit(1);
    
    return NextResponse.json(userPaymentRows[0], { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id][payments][:paymentId]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
