'use client';
import React, { useEffect, useState } from 'react';

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ✅ Load default movies when the page first loads
    useEffect(() => {
        fetchMovies('action'); // default category
    }, []);

    // Fetch movies from OMDb API
    const fetchMovies = async (term: string) => {
        try {
            setLoading(true);
            setError('');
            const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(term)}&apikey=8e024a81`);
            const data = await res.json();

            if (data.Response === 'False') {
                setError(data.Error || 'No movies found.');
                setMovies([]);
            } else {
                setMovies(data.Search || []);
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Handle user search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        fetchMovies(searchTerm);
    };

    return (
        <div className="p-6">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search by category or title (e.g., action, comedy, ip man)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-400 rounded-l-md p-2 w-64 sm:w-80"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            {/* Loading and error states */}
            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Movie grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => {
                    const goojaraLink = `https://www.goojara.to/search?keyword=${encodeURIComponent(movie.Title)}`;
                    return (
                        <a
                            key={movie.imdbID}
                            href={goojaraLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center border rounded-lg p-3 hover:shadow-lg transition-shadow duration-200"
                        >
                            <img
                                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
                                alt={movie.Title}
                                className="rounded-lg mb-2 w-48 h-64 object-cover"
                            />
                            <h2 className="text-lg font-bold text-center">{movie.Title}</h2>
                            <p className="text-gray-600">{movie.Year}</p>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
