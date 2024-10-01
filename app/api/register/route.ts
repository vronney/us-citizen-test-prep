import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
        }

        const client = await getMongoClient()
        const db = client.db("UserProgressSchema")

        // Check if user already exists
        const existingUser = await db.collection('userProgress').findOne({ email })
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date(),
        })

        // Create user progress document
        await db.collection('userProgress').insertOne({
            userId: result.insertedId,
            progress: [],
        })

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
    }
}