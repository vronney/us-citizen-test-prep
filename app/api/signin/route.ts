import { NextRequest, NextResponse } from 'next/server'
import getMongoClient from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { signJwtToken } from '@/lib/jwt'

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

        // Generate JWT token
        const token = signJwtToken({ id: user._id.toString() })

        // Create a response with the token
        const response = NextResponse.json({ message: 'Sign in successful', token }, { status: 200 })

        // Set the token as a cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
            path: '/',
        })

        return response
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'An error occurred during sign in' }, { status: 500 })
    }
}