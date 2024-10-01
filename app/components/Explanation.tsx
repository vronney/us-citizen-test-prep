export default function Explanation({ explanation }: { explanation: string }) {
    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Explanation:</h4>
            <p>{explanation}</p>
        </div>
    );
}