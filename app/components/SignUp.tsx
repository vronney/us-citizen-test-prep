'use client'

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSignIn, setIsSignIn] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (!isSignIn && password !== confirmPassword) {
            setError("Passwords don't match")
            setIsLoading(false)
            return
        }

        try {
            const endpoint = isSignIn ? '/api/signin' : '/api/register'
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                if (isSignIn) {
                    // Handle successful sign-in
                    router.push('/pages/quiz')
                } else {
                    // Handle successful registration
                    setIsSignIn(true) // Switch to sign-in mode
                    setError('Registration successful. Please sign in.')
                }
            } else {
                setError(data.message || `An error occurred during ${isSignIn ? 'sign in' : 'registration'}`)
            }
        } catch (error) {
            console.error(`${isSignIn ? 'Sign in' : 'Registration'} error:`, error)
            setError(`An error occurred during ${isSignIn ? 'sign in' : 'registration'}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isSignIn && (
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirmPassword"
                            type="password"
                            placeholder="******************"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}
                {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
                <div className="flex items-center justify-between mb-4">
                    <button
                        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (isSignIn ? 'Signing In...' : 'Signing Up...') : (isSignIn ? 'Sign In' : 'Sign Up')}
                    </button>
                </div>
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignIn(!isSignIn)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        {isSignIn ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </form>
        </div>
    )
}