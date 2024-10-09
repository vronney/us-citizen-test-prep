'use client'

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSignIn, setIsSignIn] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (name.trim() === '') {
            setName(name.trim())
        }

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
                body: JSON.stringify({ email, password, name }),
            })

            const data = await response.json()

            if (response.ok) {
                if (isSignIn) {
                    // Handle successful sign-in
                    router.push(`/pages/quiz`);
                } else {
                    // Handle successful registration
                    resetFormForSignIn();
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

    const resetFormForSignIn = () => {
        setIsSignIn(true)
        setPassword('')
        setConfirmPassword('')
        // Email is kept as is
        setError('')
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-b-transparent border-r-transparent border-l-transparent rounded-full" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-semibold text-center mb-6 text-primary">{isSignIn ? 'Login' : 'Create Account'}</h2>
                {!isSignIn && (
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            localStorage.setItem('email', e.target.value);
                        }}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {!isSignIn && (
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input input-bordered w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}
                {error && (
                    <div className="alert alert-error shadow-lg mb-4">
                        <span>{error}</span>
                    </div>
                )}
                <button type="submit" className="btn btn-primary w-full mb-4">
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                </button>
                <p className="text-center">
                    {isSignIn ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsSignIn(!isSignIn)}
                        className="text-primary hover:underline"
                    >
                        {isSignIn ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </form>
        </div>
    );
}