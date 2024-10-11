'use client';

import { useEffect, useState } from 'react';
import Explanation from './Explanation';

interface QuestionData {
    question: string;
    random_answers: string[];
    correct_answer: string | string[];
    explanation: string;
    category: string;
}

export default function Question({ question, onAnswer, onNextQuestion }: { question: QuestionData, onAnswer: (isCorrect: boolean) => void, onNextQuestion: () => void }) {
    // Check if question is defined
    if (!question) {
        return <div>Loading question...</div>;
    }

    // Ensure correct_answer and random_answers exist
    const correctAnswer = question.correct_answer || [];
    const randomAnswers = question.random_answers || [];

    // Combine correct_answer and random_answers
    const allAnswers = Array.isArray(correctAnswer)
        ? [...randomAnswers, ...correctAnswer]
        : [...randomAnswers, correctAnswer];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [answers, setAnswers] = useState(shuffledAnswers);
    const [doneAnswers, setDoneAnswers] = useState<string[]>([]);

    const sortedAnswers = answers.sort((a, b) => {
        if (doneAnswers.includes(a) && !doneAnswers.includes(b)) return 1;
        if (!doneAnswers.includes(a) && doneAnswers.includes(b)) return -1;
        return 0;
    });

    useEffect(() => {
        setSelectedAnswers([]);
        setShowResult(false);
        setIsCorrect(false);
        setAnswers([...question.random_answers, ...(Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer])]);
        setDoneAnswers([]);
    }, [question]);

    function handleAnswerSelection(answer: string) {
        setSelectedAnswers(prev =>
            prev.includes(answer)
                ? prev.filter(a => a !== answer)
                : [...prev, answer]
        );
    }

    function handleSubmit() {
        const correct = Array.isArray(question.correct_answer)
            ? question.correct_answer.every(a => selectedAnswers.includes(a)) &&
            selectedAnswers.length === question.correct_answer.length
            : selectedAnswers.includes(question.correct_answer);
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer(correct);

        setDoneAnswers([...doneAnswers, ...selectedAnswers]);
    }

    function handleNextQuestion() {
        setSelectedAnswers([]);
        setShowResult(false);
        onNextQuestion();
    }

    return (
        <div className="my-8">
            <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
            <ul className="space-y-2 mb-4">
                {sortedAnswers.map((answer, index) => (
                    <li key={index}>
                        <button
                            className={`btn ${selectedAnswers.includes(answer) ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => handleAnswerSelection(answer)}
                            disabled={showResult || doneAnswers.includes(answer)}
                        >
                            {answer}
                        </button>
                    </li>
                ))}
            </ul>
            {!showResult && (
                <button
                    className="btn btn-secondary"
                    onClick={handleSubmit}
                    disabled={!selectedAnswers.length}
                >
                    Submit Answer
                </button>
            )}
            {showResult && (
                <div>
                    <div className={`alert ${isCorrect ? 'alert-success' : 'alert-error'} mb-4`}>
                        {isCorrect ? 'Correct!' : 'Wrong!'}
                    </div>
                    {!isCorrect && (
                        <Explanation
                            correctAnswer={question.explanation}
                        />
                    )}
                    <button className="btn btn-primary mt-4" onClick={handleNextQuestion}>
                        Next Question
                    </button>
                </div>
            )}
        </div>
    );
}