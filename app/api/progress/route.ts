import { NextResponse } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    try {
        const client = await getMongoClient();
        const db = client.db("UserProgressSchema");
        const progress = await db.collection("userProgress").findOne({ userId: new ObjectId(userId) });

        if (!progress) {
            return NextResponse.json({ correctAnswers: 0, totalQuestions: 0 });
        }

        return NextResponse.json(progress);
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

        const result = await db.collection("userProgress").updateOne(
            { userId: new ObjectId(userId) },
            { 
                $inc: { correctAnswers, totalQuestions }, 
                $set: { lastQuizDate: new Date() } 
            },
            { upsert: true }
        );

        if (result.matchedCount === 0 && result.upsertedCount === 0) {
            return NextResponse.json({ error: 'Failed to update user progress' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Progress saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving user progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { userId } = await request.json();
        const client = await getMongoClient();
        const db = client.db("UserProgressSchema");

        const result = await db.collection("userProgress").updateOne(
            { userId: new ObjectId(userId) },
            { 
                $set: { correctAnswers: 0, totalQuestions: 0, lastQuizDate: new Date() }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Failed to reset user progress' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Progress reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error resetting user progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}