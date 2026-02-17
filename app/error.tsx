'use client'
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({ error, reset }: {
    error: Error & { digest?: string }, reset: () => void;
}) {
    useEffect(() => {
        console.log(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center w-full p-6 animate-fade-in">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-center text-4xl font-black text-white mb-3 tracking-tighter">
                Something went wrong
            </h1>
            <p className="text-gray-500 text-sm font-medium mb-8 text-center max-w-md">
                An unexpected error occurred. Please try again or return to the homepage.
            </p>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-[#ffb11e] text-black hover:bg-white transition-all px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 shadow-xl shadow-[#ffb11e]/20 active:scale-95"
                >
                    <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <Link href="/"
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                    <Home className="w-4 h-4" /> Go Home
                </Link>
            </div>
        </div>
    )
}
