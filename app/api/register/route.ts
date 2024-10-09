import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { signJwtToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password || !name) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
        }

        const client = await getMongoClient()
        const db = client.db("UserProgressSchema")

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email })
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
            name,
            createdAt: new Date(),
        })

        // Create user progress document
        await db.collection('userProgress').insertOne({
            userId: result.insertedId,
            correctAnswers: 0,
            totalQuestions: 0,
            lastQuizDate: null,
        })

        // Generate JWT token
        const token = signJwtToken({ id: result.insertedId.toString() })

        // Create a response with the token
        const response = NextResponse.json({ message: 'User registered successfully', token }, { status: 201 })

        // Set the token as a cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60, // 1 day
            path: '/',
        })
        return response
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
    }
}