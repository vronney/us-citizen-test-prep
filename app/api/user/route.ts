// @ts-nocheck

import { NextResponse, NextRequest } from 'next/server';
import getMongoClient from '@/lib/mongodb';
import { verifyJwtToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the JWT token and extract the payload
    const payload = verifyJwtToken(token);

    if (!payload || typeof payload !== 'object' || !payload.id) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
        const client = await getMongoClient();
        const db = client.db("UserProgressSchema");
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            console.log('User not found', email);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Only return necessary user information
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}