import { NextRequest, NextResponse } from "next/server";

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
