export default function Explanation({ correctAnswer }: { correctAnswer: string }) {
    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Explanation:</h4>
            <p>{correctAnswer}</p>
        </div>
    );
}