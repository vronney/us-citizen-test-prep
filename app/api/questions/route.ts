import { NextRequest, NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { verifyJwtToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  if (!token || !verifyJwtToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const client = await getMongoClient();
    const db = client.db("QuestionSchema");
    const questions = await db.collection("questions").aggregate([
      { $sample: { size: 20 } }
    ]).toArray();

    return new NextResponse(JSON.stringify(questions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Unable to fetch questions' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}