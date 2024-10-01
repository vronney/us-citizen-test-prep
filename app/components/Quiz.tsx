'use client';

import { useState, useEffect } from 'react';
import Question from '@components/Question';
import ProgressTracker from '@components/ProgressTracker';

export default function Quiz() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetchQuestions();
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    async function fetchQuestions() {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data);
    }

    function handleAnswer(isCorrect: boolean) {
        if (isCorrect) {
            setCorrectAnswers(correctAnswers + 1);
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        saveProgress();
    }

    async function saveProgress() {
        // Instead of saving to a database, we'll just update local state
        // You could implement local storage here if you want to persist the data
    }

    if (questions.length === 0) {
        return <div>Loading questions...</div>;
    }
    if (currentQuestionIndex >= questions.length) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                <p>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
                <ProgressTracker userName={userName} correctAnswers={correctAnswers} totalQuestions={questions.length} />
            </div>
        );
    }

    return (
        <div>
            <Question
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
            />
            <ProgressTracker userName={userName} correctAnswers={correctAnswers} totalQuestions={currentQuestionIndex} />
        </div>
    );
}