import { db } from "../../../../../db";
import { applications, userFeatures, users } from "../../../../../db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/users/{id}/wallets:
 *   get:
 *     summary: Find user wallets
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


    // const url = new URL(`https://api.privy.io/v1/wallets/${walletId}/balance`);
    //   if (chain) url.searchParams.append('chain', chain);
    //   if (asset) url.searchParams.append('asset', asset);
    //   url.searchParams.append('include_currency', 'usd');

    //   const auth = Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64');
    //   const resp = await fetch(url.toString(), {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Basic ${auth}`,
    //       'privy-app-id': PRIVY_APP_ID,
    //     }
    //   });
    //   if (!resp.ok) {
    //     throw new Error(`Failed to fetch balance: ${resp.status} ${await resp.text()}`);
    //   }
    //   const data = await resp.json();

    

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
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const cursor = rows[0].privy;
    const chain_type = 'ethereum';
    // console.log(owner_id)
    const url = new URL('https://api.privy.io/v1/wallets');
    url.searchParams.append('cursor', cursor!);
    url.searchParams.append('chain_type', chain_type!);

    const auth = Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64');
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'privy-app-id': process.env.PRIVY_APP_ID!,
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch balance: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[API][POST][users][:id][wallets]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
