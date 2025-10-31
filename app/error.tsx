'use client'
import {useEffect} from "react";

export default function Error({error, reset}: {
    error: Error & { digest? : string}, reset: () => void;
}) {
    useEffect(() => {
         console.log(error)
    }, [error]);
    return (
        <div className="min-h-screen flex flex-col items-center justify-center w-full mb-6">
            <h1 className="text-center text-5xl font-bold text-gray-900">
                something went wrong
            </h1>
            <button onClick={() => reset()} className="bg-amber-600 hover:bg-amber-600 focus:outline-none mt-6 px-5 py-2 rounded-lg">
                try again
            </button>
        </div>
    )
}
