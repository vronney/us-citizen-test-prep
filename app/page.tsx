import Link from "next/link"

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">US Citizenship Test Practice</h1>
          <p className="mb-8 text-lg">Welcome to the ultimate preparation tool for your US Citizenship Test. Boost your confidence and knowledge with our comprehensive practice quizzes!</p>
          <Link href="/pages/signup" className="btn btn-primary btn-lg">
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}