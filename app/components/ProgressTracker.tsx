'use client';

interface ProgressTrackerProps {
    userName: string;
    correctAnswers: number;
    totalQuestions: number;
}

export default function ProgressTracker({ userName, correctAnswers, totalQuestions }: ProgressTrackerProps) {
    if (!userName) {
        return (
            <div className="mt-8 p-4 bg-blue-100 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Welcome to the US Citizenship Test Practice!</h3>
                <p>Please enter your name to start tracking your progress.</p>
            </div>
        );
    }

    if (totalQuestions === 0) {
        return (
            <div className="mt-8 p-4 bg-green-100 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Welcome, {userName}!</h3>
                <p>You haven't attempted any questions yet. Start the quiz to begin tracking your progress.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
            <p>Correct Answers: {correctAnswers}</p>
            <p>Total Questions Attempted: {totalQuestions}</p>
            <p>Accuracy: {((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
        </div>
    );
}