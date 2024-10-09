import { NextResponse, NextRequest } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verifyJwtToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;

    if (!token || !email || !verifyJwtToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const client = await getMongoClient();
        const db = client.db("UserProgressSchema");
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { userId, correctAnswers, totalQuestions } = await request.json();
        const client = await getMongoClient();
        const db = client.db("UserProgressSchema");

        const result = await db.collection('userProgress').updateOne(
            { userId: new ObjectId(userId) },
            { $set: { correctAnswers, totalQuestions } },
            { upsert: true }
        );

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            return NextResponse.json({ error: 'Failed to update user progress' }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error updating user progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}