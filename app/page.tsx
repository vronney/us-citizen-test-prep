import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">US Citizenship Test Practice</h1>
      <div>
        <p>Welcome to the US Citizenship Test Practice!</p>
        <Link href="/pages/signin" className="text-blue-500 hover:underline">
          Start Quiz
        </Link>
      </div>
    </main>
  )
}