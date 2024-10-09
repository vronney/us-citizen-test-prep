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
    const progressPercentage = (correctAnswers / totalQuestions) * 100;

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

            <div className="flex flex-col items-center mt-6">
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <span className="text-sm mt-2">{`Progress: ${correctAnswers}/${totalQuestions} (${progressPercentage.toFixed(1)}%)`}</span>
            </div>
        </div>
    );
}