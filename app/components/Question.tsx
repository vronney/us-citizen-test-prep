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
    const allAnswers = Array.isArray(question.correct_answer)
        ? [...question.random_answers, ...question.correct_answer]
        : [...question.random_answers, question.correct_answer];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
        setAnswers([...question.random_answers, ...(Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer])]);
        setDoneAnswers([]);
    }, [question]);

    function handleSubmit() {
        const correct = selectedAnswer === question.correct_answer;
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer(correct);

        if (selectedAnswer && !doneAnswers.includes(selectedAnswer)) {
            setDoneAnswers([...doneAnswers, selectedAnswer]);
        }
    }

    function handleNextQuestion() {
        setSelectedAnswer(null);
        setShowResult(false);
        onNextQuestion();
    }

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
            <ul className="space-y-2 mb-4">
                {sortedAnswers.map((answer, index) => (
                    <li key={index}>
                        <button
                            className={`btn ${selectedAnswer === answer ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setSelectedAnswer(answer)}
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
                    disabled={!selectedAnswer}
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
                            correctAnswer={
                                Array.isArray(question.correct_answer)
                                    ? question.correct_answer.join(', ')
                                    : question.correct_answer
                            }
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