'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Question from '@components/Question';
import ProgressTracker from '@components/ProgressTracker';
import { useAuth } from '../contexts/AuthContext';

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [lastQuizDate, setLastQuizDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { token } = useAuth();
    const email = localStorage.getItem('email') || '';

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            if (!token) {
                console.log("No token found, redirecting to signup page...")
                router.push('/pages/signup');
            } else {
                console.log("Token found, fetching user data and questions...")
                setIsLoading(true)
                await fetchUserData();
                await fetchQuestions();
                setIsLoading(false)
            }
        };

        checkAuthAndFetchData();
    }, [token, router]);

    async function fetchUserData() {
        if (!token) {
            console.error('Token is missing');
            return;
        }
        setIsLoading(true)
        try {
            if (email) {
                const response = await fetch(`/api/user?email=${email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                // console.log('User data:', data);
                setUserName(data.name);
                setUserId(data._id);

                if (data._id) {
                    fetchUserProgress(data._id);
                } else {
                    console.error('User ID is missing in the response');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchQuestions() {
        setIsLoading(true)
        try {
            const response = await fetch('/api/questions', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    // Token might be expired, redirect to login
                    router.push('/pages/signup');
                    return;
                }
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchUserProgress(userId: string) {
        if (!userId) {
            console.error('User ID is undefined');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/progress?userId=${userId}`);
            const data = await response.json();
            setTotalQuestions(data.totalQuestions);
            setCorrectAnswers(data.correctAnswers);
            setLastQuizDate(data.lastQuizDate);
        } catch (error) {
            console.error('Error fetching user progress:', error);
        } finally {
            setIsLoading(false);
        }
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

    async function saveProgress() {
        const response = await fetch('/api/progress', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, correctAnswers, totalQuestions, lastQuizDate: new Date() }),
        });
        const data = await response.json();
        if (data.success) {
            console.log('Progress saved successfully');
        } else {
            console.error('Failed to save progress');
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-b-transparent border-r-transparent border-l-transparent rounded-full" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (currentQuestionIndex >= questions.length) {
        return (
            <div className='p-6 max-w-2xl mx-auto'>
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p className='text-black'>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
                <ProgressTracker userName={userName} correctAnswers={correctAnswers} totalQuestions={totalQuestions} isLoading={isLoading} />
                <button onClick={() => router.push('/pages/quiz')} className="btn btn-primary my-4">Retake Quiz</button>
            </div>
        );
    }
    return (
        <div className='p-6 max-w-2xl mx-auto'>
            <ProgressTracker userName={userName} correctAnswers={correctAnswers} totalQuestions={totalQuestions} isLoading={isLoading} />
            <Question
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                onNextQuestion={handleNextQuestion}
            />
        </div>
    );
}