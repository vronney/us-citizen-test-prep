"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Quiz from "@/app/components/Quiz"
import { useAuth } from '@/app/contexts/AuthContext'

export default function QuizPage() {
    const router = useRouter()
    const { token } = useAuth()

    useEffect(() => {
        if (!token) {
            console.log("No token found in QuizPage, redirecting to signup...")
            router.push('/pages/signup')
        }
    }, [token, router])

    if (!token) {
        return null // or a loading spinner
    }

    return <Quiz />
}