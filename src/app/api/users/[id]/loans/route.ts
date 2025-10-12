import { db } from "@/db";
import { applications, userLoans } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { JsonRpcProvider, Contract, Wallet, parseUnits } from 'ethers';

/**
 * @swagger
 * /api/users/{id}/loans:
 *   get:
 *     summary: Find user loans
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
    const rows = await db
      .select()
      .from(userLoans)
      .where(eq(userLoans.userId, id))

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('[API][GET][users][:id][loans]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}


/**
 * @swagger
 * /api/users/{id}/loans:
 *   post:
 *     summary: create user loans
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
export const POST = async (request: NextRequest, context: any) => {
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

    const status = 'pending';
    const params = await context.params;
    const userId = Number(params.id);

    const data = await request.json();

    const interest = Math.round((data.amount/30 * Number(applicationRows[0]?.interest)*7) * 100) / 100;
    const total = Math.round((data.term * 4 * Number(interest) + data.amount) * 100) / 100;

    // const userLoanRows = await db
    //   .insert(userLoans)
    //   .values({ ...data, userId, interest, total, status })
    //   .returning({ id: userLoans.id });

    const auth = Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64');
    
    const walletURL = new URL(`https://api.privy.io/v1/wallets/${data.walletId}`);
    const walletResponse = await fetch(walletURL.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'privy-app-id': process.env.PRIVY_APP_ID!,
      }
    });

    if (!walletResponse.ok) {
      const text = await walletResponse.text();
      throw new Error(`Failed to fetch wallet: ${walletResponse.status} ${text}`);
    }

    const walletData = await walletResponse.json();
    console.log(walletData)
    console.log('-'.repeat(100))
    const provider = new JsonRpcProvider("https://mainnet.base.org");
    const wallet = new Wallet(process.env.BASE_ORG_SECRET_KEY!, provider);

    const ERC20_ABI = [
      "function transfer(address to, uint256 value) public returns (bool)",
    ];
    const usdc = new Contract("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", ERC20_ABI, wallet);
    const value = parseUnits(data.amount.toString(), 6);
    const transaction = await usdc.transfer(walletData.address, value);
    console.log(transaction);
    console.log('-'.repeat(100))
    const transactionReceipt = await transaction.wait(1);
    console.log(transactionReceipt);
    console.log('-'.repeat(100));

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.error('[API][POST][users][:id][loans]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}



