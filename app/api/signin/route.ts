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

        // Find the user
        const user = await db.collection('users').findOne({ email })
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
        }

        // Here you would typically create a session or generate a JWT token
        // For this example, we'll just return a success message
        return NextResponse.json({ message: 'Sign in successful' }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'An error occurred during sign in' }, { status: 500 })
    }
}