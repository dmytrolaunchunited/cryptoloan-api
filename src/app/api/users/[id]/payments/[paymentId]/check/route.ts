import { db } from "@/db";
import { applications, userPayments, userPaymentTransactions } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { Mnemonic, HDNodeWallet, JsonRpcProvider, Wallet, Contract, parseUnits } from "ethers";

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
    
    try {
      const masterMnemonic = Mnemonic.fromPhrase(process.env.MASTER_MNEMONIC!);
      const master = HDNodeWallet.fromMnemonic(masterMnemonic);

      const provider = new JsonRpcProvider(process.env.BASE_ORG_RPC_URL);

      const walletChild = master.derivePath(`44'/60'/0'/0/${rows[0]?.id}`);
      const wallet = new Wallet(process.env.BASE_ORG_SECRET_KEY!, provider);

      const ERC20_ABI = [
        "function transfer(address to, uint256 value) public returns (bool)",
      ];
      const usdc = new Contract(process.env.BASE_ORG_TARGET!, ERC20_ABI, walletChild);

      const value = parseUnits(rows[0]?.amount?.toString()!, 6);
      const transaction = await usdc.transfer(wallet.address, value);
      const transactionReceipt = await transaction.wait(1);
      
      await db
        .insert(userPaymentTransactions)
        .values({
          userPaymentId: rows[0].id,
          wallet: JSON.stringify(walletChild),
          transaction: JSON.stringify(transaction),
          transactionReceipt: JSON.stringify(transactionReceipt),
        });
      if (transactionReceipt.status) {
        await db
          .update(userPayments)
          .set({ status: transactionReceipt.status ? "completed" : "canceled" })
          .where(eq(userPayments.id, rows[0].id));
      } else {
        throw new Error('Oops! Something went wrong.')
      }
    } catch (err) {
      await db
        .insert(userPaymentTransactions)
        .values({
          userPaymentId: rows[0].id,
          transaction: JSON.stringify(err),
        });

      await db
        .update(userPayments)
        .set({ status: 'canceled' })
        .where(eq(userPayments.id, rows[0].id));

      throw new Error('Oops! Something went wrong.');
    }

    return NextResponse.json({ status: 201 });
  } catch (error) {


    console.error('[API][GET][users][:id][payments][:paymentId][check]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}