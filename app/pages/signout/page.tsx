import Link from 'next/link';

export default function SignoutPage() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold mb-8">You've been signed out</h1>
                    <p className="mb-8 text-lg">Thank you for using our US Citizenship Test Practice app. We hope to see you again soon!</p>
                    <Link href="/" className="btn btn-primary btn-lg">
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}