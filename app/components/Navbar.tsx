'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { isSignIn, setIsSignIn, setToken } = useAuth();
    const router = useRouter();

    const handleSignOut = () => {
        setToken(null);
        setIsSignIn(false);
        router.push('/');
    };

    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">US Citizenship Test</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    {isSignIn ? (
                        <>
                            <li><button onClick={handleSignOut} className='btn btn-secondary'>Sign Out</button></li>
                        </>
                    ) : (
                        <li><Link href="/pages/signup" className='btn btn-primary'>Sign In / Sign Up</Link></li>
                    )}
                </ul>
            </div>
        </div>
    );
}