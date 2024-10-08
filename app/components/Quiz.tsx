'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Question from '@components/Question';
import ProgressTracker from '@components/ProgressTracker';

export default function Quiz({ id }: { id: string }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [lastQuizDate, setLastQuizDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const email = localStorage.getItem('email') || '';

    useEffect(() => {
        fetchQuestions();
        fetchUserData();
    }, []);

    async function fetchUserData() {
        const response = await fetch(`/api/user?email=${email}`);
        const data = await response.json();
        setUserName(data.name);
        setUserId(data._id);
        fetchUserProgress(data._id);
    }

    async function fetchUserProgress(userId: string) {
        setIsLoading(true);
        const response = await fetch(`/api/progress?userId=${userId}`);
        const data = await response.json();
        setTotalQuestions(data.totalQuestions);
        setCorrectAnswers(data.correctAnswers);
        setLastQuizDate(data.lastQuizDate);
        setIsLoading(false);
    }

    async function fetchQuestions() {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
    }

    function handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            setCorrectAnswers(correctAnswers + 1);
        }
        setTotalQuestions(totalQuestions + 1);
    }

    function handleNextQuestion() {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        saveProgress();
    }

    function handleSignOut() {
        localStorage.removeItem('email');
        router.push('/pages/signin');
    }

    async function saveProgress() {
        const response = await fetch('/api/progress', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, correctAnswers, totalQuestions, lastQuizDate: new Date() }),
        });
        const data = await response.json();
        if (data.success) {
            console.log('Progress saved successfully');
        } else {
            console.error('Failed to save progress');
        }
    }

    if (currentQuestionIndex >= questions.length) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
                <ProgressTracker userName={userName} correctAnswers={correctAnswers} totalQuestions={totalQuestions} isLoading={isLoading} />
                <button onClick={() => router.push('/pages/quiz')} className="btn btn-primary mt-4">Retake Quiz</button>
            </div>
        );
    }

    return (
        <div>
            <ProgressTracker userName={userName} correctAnswers={correctAnswers} totalQuestions={totalQuestions} isLoading={isLoading} />
            <button onClick={handleSignOut} className='btn btn-secondary mt-4'>Sign Out</button>
            <Question
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                onNextQuestion={handleNextQuestion}
            />
        </div>
    );
}