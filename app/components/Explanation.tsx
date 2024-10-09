export default function Explanation({ correctAnswer }: { correctAnswer: string }) {
    return (
        <div className="border border-red-300 bg-red-50 p-4 rounded-lg mt-4">
            <h3 className="text-red-600 font-bold mb-2">Explanation</h3>
            <p className="text-gray-700">{correctAnswer}</p>
        </div>
    );
}