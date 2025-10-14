import { db } from "@/db";
import { applications, userLoans, userLoanTransactions, userPayments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, sql, and } from "drizzle-orm";
import { JsonRpcProvider, Contract, Wallet, parseUnits } from 'ethers';
import { randomUUID } from "crypto";

const calculateMonthDays = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
}

const calculateTermDays = (startDate: Date, termMonths: number): number => {
  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth();

  return Array.from({ length: termMonths }).reduce<number>((accumulator, _, i) => {
    const monthIndex = startMonth + i;
    const year = startYear + Math.floor(monthIndex / 12);
    const month = monthIndex % 12;
    return accumulator + calculateMonthDays(year, month);
  }, 0);
}

const calculateDay = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const calculatePaymentDays = (startDate: Date, termMonths: number, repayment: "single-payment" | "2-monthly-payments"): Date[] => {
  const totalDays = calculateTermDays(startDate, termMonths);
  const dates: Date[] = [];

  if (repayment === "single-payment") {
    const date = calculateDay(startDate, totalDays);
    dates.push(date);
  }
  if (repayment === "2-monthly-payments") {
    const numPayments = termMonths * 2;
    for (let i = 1; i <= numPayments; i++) {
      const dateOffset = Math.round((totalDays * i) / numPayments);
      const date = calculateDay(startDate, dateOffset);
      dates.push(date);
    }
  }
  return dates;
}

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

    const status = request.nextUrl.searchParams.get('status');
    const take = request.nextUrl.searchParams.get('take');
    const skip = request.nextUrl.searchParams.get('skip');
    const params = await context.params;

    const id = Number(params.id);
    const rows = await db
      .select()
      .from(userLoans)
      .limit(Number(take))
      .offset(Number(skip))
      .where(status ? and(
        eq(userLoans.userId, id),
        eq(userLoans.status, status),
      ) : eq(userLoans.userId, id))

    const [countRows] = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
      })
      .from(userLoans)
      .where(status ? and(
        eq(userLoans.userId, id),
        eq(userLoans.status, status),
      ) : eq(userLoans.userId, id));

    const total = countRows.total;

    return NextResponse.json({ rows, total }, { status: 200 });
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

    const params = await context.params;

    const userId = Number(params.id);

    const data = await request.json();
    const days = calculateTermDays(new Date(), data.term);

    const total = Number(data.amount + (Number(applicationRows[0]?.interest)/100 * days)).toFixed(2);
    const interest =  Number((Number(total) - data.amount) / 4).toFixed(2);

    const userLoanRows = await db
      .insert(userLoans)
      .values({ ...data, userId, interest, total, status: 'pending' })
      .returning({ id: userLoans.id });

    try {
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

      const provider = new JsonRpcProvider("https://mainnet.base.org");
      const wallet = new Wallet(process.env.BASE_ORG_SECRET_KEY!, provider);

      const ERC20_ABI = [
        "function transfer(address to, uint256 value) public returns (bool)",
      ];
      const usdc = new Contract("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", ERC20_ABI, wallet);
      const value = parseUnits(data.amount.toString(), 6);
      const transaction = await usdc.transfer(walletData.address, value);

      const transactionReceipt = await transaction.wait(1);

      await db
        .insert(userLoanTransactions)
        .values({
          userLoanId: userLoanRows[0].id,
          wallet: JSON.stringify(wallet),
          transaction: JSON.stringify(transaction),
          transactionReceipt: JSON.stringify(transactionReceipt),
        });
      if (transactionReceipt.status) {
        await db
          .update(userLoans)
          .set({ status: transactionReceipt.status ? "approved" : "canceled" })
          .where(eq(userLoans.id, userLoanRows[0].id));

        const userLoanId = 36;

        const days = calculatePaymentDays(new Date(), data.term, data.repayment);
        const amount = Math.floor((Number(total) / days.length) * 100) / 100; 
        const payments = days.map((i) => {
          const uuid = randomUUID();
          const paymentAt = new Date(i);
          return { uuid, userId, amount, paymentAt, userLoanId, status: "pending" };
        }) as unknown as Array<typeof userPayments.$inferInsert>;

        await db
          .insert(userPayments)
          .values(payments);

      } else {
        throw new Error('Oops! Something went wrong.');
      }
    } catch (err) {
      await db
        .insert(userLoanTransactions)
        .values({
          userLoanId: userLoanRows[0].id,
          transaction: JSON.stringify(err),
        });

      await db
        .update(userLoans)
        .set({ status: 'canceled' })
        .where(eq(userLoans.id, userLoanRows[0].id));

      throw new Error('Oops! Something went wrong.');
    }
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error('[API][POST][users][:id][loans]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}



