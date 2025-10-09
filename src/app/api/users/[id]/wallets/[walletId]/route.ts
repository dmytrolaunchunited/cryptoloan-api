import { db } from "../../../../../../db";
import { applications, users } from "../../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

// async function exchange() {
//   const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eth');
//   const data = await response.json();
//   return data.tether.eth;
// }

/**
 * @swagger
 * /api/users/{userId}/wallets/{walletId}:
 *   get:
 *     summary: Find user wallet
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

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!userRows.length) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const auth = Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64');
    
    const walletURL = new URL(`https://api.privy.io/v1/wallets/${params.walletId}`);
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

    const walletBalanceURL = new URL(`https://api.privy.io/v1/wallets/${params.walletId}/balance`);
    walletBalanceURL.searchParams.append('chain', "ethereum");
    walletBalanceURL.searchParams.append('asset', "usdt");
    const walletBalanceResponse = await fetch(walletBalanceURL.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'privy-app-id': process.env.PRIVY_APP_ID!,
      }
    });

    if (!walletBalanceResponse.ok) {
      const text = await walletBalanceResponse.text();
      throw new Error(`Failed to fetch wallet: ${walletBalanceResponse.status} ${text}`);
    }
    
    const walletBalanceData = await walletBalanceResponse.json();

    return NextResponse.json({ ...walletData, ...walletBalanceData }, { status: 200 });
  } catch (error) {
    console.error('[API][POST][users][:id][wallets]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
