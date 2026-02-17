'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Clock, Globe, Award, ExternalLink, Play, Film, Info, User, PenTool, Hash, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface MovieDetail {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
}

export default function MovieDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=8e024a81`);
                const data = await res.json();
                if (data.Response === 'False') {
                    setError(data.Error);
                } else {
                    setMovie(data);
                }
            } catch (err) {
                setError('Failed to fetch movie details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMovieDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#ffb11e] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 animate-pulse text-lg font-black tracking-tighter">FETCHING TREASURES...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">ERROR 404</h1>
                <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest">{error || 'Movie not found'}</p>
                <Link href="/" className="bg-[#ffb11e] text-black px-10 py-4 rounded-2xl hover:bg-white transition-all font-black shadow-xl">
                    RETURN TO HOME
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-[#ffb11e]/30">
            {/* Backdrop Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                    className="w-full h-full object-cover blur-[80px] opacity-[0.15] scale-110"
                    alt="backdrop"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-transparent to-[#0f0f0f]" />
            </div>

            <nav className="fixed top-0 left-0 right-0 h-16 bg-[#161616]/80 backdrop-blur-xl z-50 border-b border-white/5 flex items-center px-4 md:px-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#ffb11e] transition-all font-bold text-sm uppercase tracking-widest group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Go Back</span>
                </button>
            </nav>

            <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
                {/* Hero Layout */}
                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                    {/* Poster */}
                    <div className="w-full lg:w-[350px] shrink-0">
                        <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5 group">
                            <img
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                alt={movie.Title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                                <a
                                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                                    target="_blank"
                                    className="bg-[#ffb11e] text-black px-6 py-3 rounded-xl font-black text-xs tracking-widest"
                                >
                                    IMDb PROFILE
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 space-y-8 lg:pt-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-[#ffb11e] text-black px-3 py-1 rounded-md font-black text-xs tracking-widest uppercase shadow-lg shadow-[#ffb11e]/20">
                                {movie.Type}
                            </span>
                            {movie.Genre.split(',').map(genre => (
                                <span key={genre} className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    {genre.trim()}
                                </span>
                            ))}
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest">
                                {movie.Rated}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] drop-shadow-2xl">
                            {movie.Title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-10 gap-y-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                                <Star className="w-5 h-5 text-[#ffb11e] fill-[#ffb11e]" />
                                <span className="text-xl text-white font-black">{movie.imdbRating}</span>
                                <span className="text-[10px] opacity-40">/ 10</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <span className="text-white">{movie.Year}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-gray-500" />
                                <span className="text-white">{movie.Runtime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gray-500" />
                                <span className="text-white">{movie.Language.split(',')[0]}</span>
                            </div>
                        </div>

                        <p className="text-xl text-gray-300 leading-relaxed max-w-4xl font-medium line-clamp-6">
                            {movie.Plot}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <a
                                href={`https://www.goojara.to/search?keyword=${encodeURIComponent(movie.Title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#ffb11e] text-black px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:bg-white transition-all transform active:scale-95 shadow-2xl shadow-[#ffb11e]/10"
                            >
                                <Play className="w-6 h-6 fill-current" />
                                WATCH NOW
                            </a>
                            <button className="bg-white/5 backdrop-blur-md border border-white/5 px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:bg-white/10 transition-all text-gray-300">
                                <Hash className="w-6 h-6" />
                                SAVE TO LIST
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Cast & Crew Section */}
                        <div className="bg-[#161616] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                            <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                                <User className="text-[#ffb11e]" />
                                CAST & CREW
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">DIRECTOR</h4>
                                    <p className="text-lg font-bold text-white leading-tight">{movie.Director}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">ACTORS</h4>
                                    <p className="text-lg font-bold text-gray-300 leading-tight">{movie.Actors}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">WRITER</h4>
                                    <p className="text-lg font-bold text-gray-300 leading-tight">{movie.Writer}</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">AWARDS</h4>
                                    <div className="flex items-start gap-3">
                                        <Award className="w-5 h-5 text-[#ffb11e] shrink-0" />
                                        <p className="text-lg font-bold text-[#ffb11e] italic leading-tight">{movie.Awards}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Ratings & Production */}
                    <aside className="space-y-8">
                        <div className="bg-[#161616] rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                <TrendingUp className="text-[#ffb11e]" />
                                ANALYTICS
                            </h3>
                            <div className="space-y-8">
                                {movie.Ratings.map(rating => (
                                    <div key={rating.Source} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{rating.Source}</span>
                                            <span className="text-sm font-black text-white">{rating.Value}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#ffb11e] shadow-[0_0_10px_rgba(255,177,30,0.5)] transition-all duration-1000"
                                                style={{ width: rating.Value.includes('/') ? `${(parseFloat(rating.Value) / (rating.Value.includes('/100') ? 100 : 10)) * 100}%` : rating.Value }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {movie.Metascore !== 'N/A' && (
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">METASCORE</h4>
                                            <p className="text-xs text-gray-600 font-bold mt-1">Based on critical reviews</p>
                                        </div>
                                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 rotate-3">
                                            <span className="text-xl font-black text-black">{movie.Metascore}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#ffb11e] rounded-[2.5rem] p-8 text-black shadow-2xl shadow-[#ffb11e]/20 group">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">COUNTRY OF ORIGIN</h4>
                            <p className="text-2xl font-black group-hover:translate-x-1 transition-transform">{movie.Country}</p>
                            <div className="mt-8 pt-6 border-t border-black/10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">BOX OFFICE RELEASE</h4>
                                <p className="text-xl font-black">{movie.Released}</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <footer className="relative z-10 py-20 border-t border-white/5 text-center px-4">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="bg-[#ffb11e] p-1.5 rounded-lg">
                        <Play className="w-6 h-6 text-black fill-current" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">MOVIEHUB</span>
                </div>
                <p className="text-gray-600 text-xs font-black tracking-[0.3em] uppercase">© 2024 MASTERPIECE EDITION • ALL RIGHTS RESERVED</p>
            </footer>
        </div>
    );
}
