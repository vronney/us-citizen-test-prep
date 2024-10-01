'use client';

import { useState } from 'react';
import Explanation from './Explanation';

interface QuestionData {
    question: string;
    answers: string[];
    correctAnswer: string;
    explanation: string;
    onAnswer: (isCorrect: boolean) => void;
}

export default function Question({ question, onAnswer }: { question: QuestionData, onAnswer: (isCorrect: boolean) => void }) {
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleAnswer = (isCorrect: boolean) => {
        onAnswer(isCorrect);
    }

    function handleAnswerClick(answer: string) {
        setSelectedAnswer(answer);
        handleAnswer(answer === question.correctAnswer);
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
            <ul className="space-y-2">
                {question.answers.map((answer: string, index: number) => (
                    <li key={index}>
                        <button
                            className={`btn ${selectedAnswer === answer ? 'btn-primary' : 'btn-outline'
                                }`}
                            onClick={() => handleAnswerClick(answer)}
                        >
                            {answer}
                        </button>
                    </li>
                ))}
            </ul>
            <button
                className="btn btn-secondary mt-4"
                onClick={() => setShowExplanation(!showExplanation)}
            >
                {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            {showExplanation && <Explanation explanation={question.explanation} />}
        </div>
    );
}