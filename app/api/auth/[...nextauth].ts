import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import getMongoClient from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const client = await getMongoClient()
                const db = client.db("UserProgressSchema")
                const user = await db.collection('users').findOne({ email: credentials.email })

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    return { id: user._id.toString(), email: user.email }
                }

                return null
            }
        }),
        // GitHubProvider removed as per instructions
    ],
    // ... other NextAuth options ...
    
})