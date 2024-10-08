"use client"

import Quiz from "@/app/components/Quiz"


export default function QuizPage({ searchParams }: { searchParams: { id: string } }) {
    const { id } = searchParams;
    return <Quiz id={id} />
}