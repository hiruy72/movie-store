'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Star, Calendar, Clock, Globe, Award,
    ExternalLink, Play, Film, Info, User, PenTool,
    Hash, TrendingUp, Share2, Bookmark, ChevronRight, Sparkles
} from 'lucide-react';
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
    BoxOffice?: string;
    Production?: string;
}

interface SimilarMovie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export default function MovieDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [similar, setSimilar] = useState<SimilarMovie[]>([]);

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
                    // Fetch similar movies based on first genre keyword
                    const firstGenre = data.Genre?.split(',')[0]?.trim();
                    if (firstGenre) {
                        const similarRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(firstGenre)}&apikey=8e024a81`);
                        const similarData = await similarRes.json();
                        if (similarData.Search) {
                            setSimilar(similarData.Search.filter((m: SimilarMovie) => m.imdbID !== id).slice(0, 6));
                        }
                    }
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
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-2 border-[#ffb11e]/30 rounded-full" />
                    <div className="w-16 h-16 border-2 border-[#ffb11e] border-t-transparent rounded-full animate-spin absolute inset-0" />
                </div>
                <p className="text-gray-500 animate-pulse text-xs font-black tracking-[0.3em] uppercase mt-6">Loading details...</p>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Film className="w-10 h-10 text-gray-600" />
                </div>
                <h1 className="text-4xl font-black text-white mb-3 tracking-tighter">Not Found</h1>
                <p className="text-gray-500 mb-8 font-semibold text-sm">{error || 'This movie could not be found'}</p>
                <Link href="/" className="bg-[#ffb11e] text-black px-8 py-3.5 rounded-xl hover:bg-white transition-all font-black text-sm shadow-xl shadow-[#ffb11e]/20">
                    RETURN HOME
                </Link>
            </div>
        );
    }

    const ratingToPercent = (value: string): number => {
        if (value.includes('/100')) return parseFloat(value);
        if (value.includes('/10')) return parseFloat(value) * 10;
        if (value.includes('%')) return parseFloat(value);
        return parseFloat(value) * 10;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb11e]/30">
            {/* Backdrop Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                    className="w-full h-full object-cover blur-[100px] opacity-[0.1] scale-125"
                    alt="backdrop"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 md:px-8 animate-slide-down">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#ffb11e] transition-all font-bold text-sm group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline uppercase tracking-wider text-xs">Go Back</span>
                </button>

                <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="bg-[#ffb11e] p-1.5 rounded-lg shadow-lg shadow-[#ffb11e]/20">
                        <Play className="w-4 h-4 text-black fill-current" />
                    </div>
                    <span className="text-lg font-black tracking-tighter">
                        MOVIE<span className="text-[#ffb11e]">HUB</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all" title="Share">
                        <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all" title="Bookmark">
                        <Bookmark className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </nav>

            <main className="relative z-10 pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
                {/* Hero Layout */}
                <div className="flex flex-col lg:flex-row gap-10 mb-16 animate-fade-in">
                    {/* Poster */}
                    <div className="w-full max-w-[300px] mx-auto lg:mx-0 lg:w-[300px] shrink-0">
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8)] border border-white/5 group animate-scale-in">
                            <img
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                alt={movie.Title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                                <a
                                    href={`https://www.imdb.com/title/${movie.imdbID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#ffb11e] text-black px-5 py-2.5 rounded-xl font-black text-xs tracking-wider flex items-center gap-2 shadow-xl"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" /> IMDb
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 space-y-6 lg:pt-4 animate-slide-up">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="bg-[#ffb11e] text-black px-3 py-1 rounded-lg font-black text-[10px] tracking-widest uppercase shadow-lg shadow-[#ffb11e]/20">
                                {movie.Type}
                            </span>
                            {movie.Genre.split(',').map(genre => (
                                <span key={genre} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {genre.trim()}
                                </span>
                            ))}
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {movie.Rated}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                            {movie.Title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold">
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                                <Star className="w-5 h-5 text-[#ffb11e] fill-[#ffb11e]" />
                                <span className="text-lg text-white font-black">{movie.imdbRating}</span>
                                <span className="text-[10px] text-gray-500 font-bold">/10</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>{movie.Year}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{movie.Runtime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Globe className="w-4 h-4 text-gray-500" />
                                <span>{movie.Language.split(',')[0]}</span>
                            </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed max-w-3xl text-base">
                            {movie.Plot}
                        </p>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1.5">Director</p>
                                <p className="text-sm font-bold text-white">{movie.Director}</p>
                            </div>
                            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1.5">Cast</p>
                                <p className="text-sm font-bold text-gray-300 line-clamp-1">{movie.Actors}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <a
                                href={`https://www.goojara.to/search?keyword=${encodeURIComponent(movie.Title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#ffb11e] text-black px-8 py-4 rounded-xl font-black text-sm flex items-center gap-2.5 hover:bg-white transition-all active:scale-95 shadow-xl shadow-[#ffb11e]/15"
                            >
                                <Play className="w-5 h-5 fill-current" /> WATCH NOW
                            </a>
                            <button className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl font-bold text-sm flex items-center gap-2.5 hover:bg-white/10 transition-all text-gray-300">
                                <Bookmark className="w-5 h-5" /> SAVE TO LIST
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="lg:col-span-2 space-y-8">
                        {/* Cast & Crew Section */}
                        <div className="bg-[#141414] rounded-2xl p-8 border border-white/5">
                            <h3 className="text-lg font-black mb-8 flex items-center gap-2.5">
                                <User className="text-[#ffb11e] w-5 h-5" />
                                CAST & CREW
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <h4 className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Director</h4>
                                    <p className="text-base font-bold text-white">{movie.Director}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Actors</h4>
                                    <p className="text-base font-semibold text-gray-300">{movie.Actors}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Writer</h4>
                                    <p className="text-base font-semibold text-gray-300">{movie.Writer}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <h4 className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Awards</h4>
                                    <div className="flex items-start gap-2">
                                        <Award className="w-4 h-4 text-[#ffb11e] shrink-0 mt-0.5" />
                                        <p className="text-base font-semibold text-[#ffb11e] italic">{movie.Awards}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Similar Movies */}
                        {similar.length > 0 && (
                            <div>
                                <h3 className="text-lg font-black mb-6 flex items-center gap-2.5">
                                    <Sparkles className="text-[#ffb11e] w-5 h-5" />
                                    YOU MAY ALSO LIKE
                                </h3>
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 stagger-children">
                                    {similar.map((m) => (
                                        <Link key={m.imdbID} href={`/movie/${m.imdbID}`} className="group">
                                            <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 group-hover:border-[#ffb11e]/20 transition-all group-hover:-translate-y-1 shadow-lg">
                                                <img
                                                    src={m.Poster !== 'N/A' ? m.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt={m.Title}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <h4 className="text-[11px] font-bold line-clamp-1 group-hover:text-[#ffb11e] transition-colors">{m.Title}</h4>
                                            <p className="text-[10px] text-gray-600 font-semibold">{m.Year}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Ratings & Production */}
                    <aside className="space-y-6">
                        <div className="bg-[#141414] rounded-2xl p-8 border border-white/5">
                            <h3 className="text-base font-black mb-6 flex items-center gap-2.5">
                                <TrendingUp className="text-[#ffb11e] w-5 h-5" />
                                RATINGS
                            </h3>
                            <div className="space-y-6">
                                {movie.Ratings.map(rating => (
                                    <div key={rating.Source} className="space-y-2.5">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{rating.Source}</span>
                                            <span className="text-sm font-black text-white">{rating.Value}</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#ffb11e] to-[#f59e0b] rounded-full shadow-[0_0_10px_rgba(255,177,30,0.4)] transition-all duration-1000"
                                                style={{ width: `${ratingToPercent(rating.Value)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {movie.Metascore !== 'N/A' && (
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Metascore</h4>
                                            <p className="text-[10px] text-gray-600 font-semibold mt-1">Critical reviews</p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg font-black text-lg text-black ${parseInt(movie.Metascore) >= 70 ? 'bg-green-500 shadow-green-500/20' :
                                                parseInt(movie.Metascore) >= 50 ? 'bg-yellow-500 shadow-yellow-500/20' :
                                                    'bg-red-500 shadow-red-500/20'
                                            }`}>
                                            {movie.Metascore}
                                        </div>
                                    </div>
                                )}

                                {movie.imdbVotes !== 'N/A' && (
                                    <div className="pt-4 border-t border-white/5">
                                        <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">IMDb Votes</h4>
                                        <p className="text-lg font-black text-white mt-1">{movie.imdbVotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Production Info */}
                        <div className="bg-gradient-to-br from-[#ffb11e] to-[#f59e0b] rounded-2xl p-6 text-black shadow-2xl shadow-[#ffb11e]/10 relative overflow-hidden">
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                            <div className="relative z-10 space-y-5">
                                <div>
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Country</h4>
                                    <p className="text-lg font-black">{movie.Country}</p>
                                </div>
                                <div className="pt-4 border-t border-black/10">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Released</h4>
                                    <p className="text-lg font-black">{movie.Released}</p>
                                </div>
                                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                                    <div className="pt-4 border-t border-black/10">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Box Office</h4>
                                        <p className="text-lg font-black">{movie.BoxOffice}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* IMDb Link */}
                        <a
                            href={`https://www.imdb.com/title/${movie.imdbID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between bg-[#141414] rounded-2xl p-5 border border-white/5 hover:border-[#ffb11e]/20 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#f5c518] rounded-xl flex items-center justify-center font-black text-black text-xs">
                                    IMDb
                                </div>
                                <div>
                                    <p className="text-sm font-bold">View on IMDb</p>
                                    <p className="text-[10px] text-gray-500 font-semibold">Full details & reviews</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#ffb11e] group-hover:translate-x-1 transition-all" />
                        </a>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-16 border-t border-white/5 text-center px-4 bg-[#0d0d0d]">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="bg-[#ffb11e] p-1.5 rounded-lg shadow-lg shadow-[#ffb11e]/20">
                        <Play className="w-5 h-5 text-black fill-current" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase">
                        MOVIE<span className="text-[#ffb11e]">HUB</span>
                    </span>
                </div>
                <p className="text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase">© 2025 Masterpiece Edition • All Rights Reserved</p>
            </footer>
        </div>
    );
}
