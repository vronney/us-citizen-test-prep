'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

interface ProgressTrackerProps {
    userName: string;
    correctAnswers: number;
    totalQuestions: number;
    isLoading: boolean;
}

export default function ProgressTracker({ userName, correctAnswers, totalQuestions, isLoading }: ProgressTrackerProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (isLoading) {
        return (
            <div className="flex w-52 flex-col gap-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
            </div>
        )
    }

    if (totalQuestions === 0 && !isLoading) {
        return (
            <div className="mt-8 p-4 bg-green-100 rounded-lg text-black">
                <h3 className="text-xl font-semibold mb-2">Welcome, {userName}!</h3>
                <p>You haven't attempted any questions yet. Start the quiz to begin tracking your progress.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 p-4 bg-green-100 text-black rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Your Progress, {userName}</h3>
            <p>Correct Answers: {correctAnswers}</p>
            <p>Total Questions Attempted: {totalQuestions}</p>
            <p>Accuracy: {((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
        </div>
    );
}