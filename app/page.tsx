'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, Calendar, Clapperboard, Star, Info, Play, Shuffle, TrendingUp, ChevronRight, Menu, Globe } from 'lucide-react';

interface Movie {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
    Plot?: string;
    imdbRating?: string;
    Genre?: string;
}

const POPULAR_IDS = [
    'tt0111161', // Shawshank
    'tt0468569', // Dark Knight
    'tt0137523', // Fight Club
    'tt0110912', // Pulp Fiction
    'tt1375666', // Inception
    'tt0068646', // Godfather
    'tt0109830', // Forrest Gump
    'tt0120338', // Titanic
    'tt0120737', // LOTR
    'tt0076759', // Star Wars
];

export default function Page() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filters
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('latest');

    // ✅ Load default movies when the page first loads
    useEffect(() => {
        fetchMovies('action');
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
                const searchResults = data.Search || [];
                const detailedMovies = await Promise.all(
                    searchResults.map(async (movie: any) => {
                        const detailRes = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&plot=short&apikey=8e024a81`);
                        return await detailRes.json();
                    })
                );
                setMovies(detailedMovies);
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        fetchMovies(searchTerm);
    };

    const handleRandom = () => {
        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)];
            router.push(`/movie/${randomMovie.imdbID}`);
        } else {
            const randomId = POPULAR_IDS[Math.floor(Math.random() * POPULAR_IDS.length)];
            router.push(`/movie/${randomId}`);
        }
    };

    // Derived data based on filters
    const filteredMovies = useMemo(() => {
        let result = [...movies];
        if (selectedType !== 'all') result = result.filter(m => m.Type === selectedType);
        if (selectedYear !== 'all') result = result.filter(m => m.Year.includes(selectedYear));

        if (sortBy === 'latest') result.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        else if (sortBy === 'oldest') result.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        else if (sortBy === 'rating') result.sort((a, b) => parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0'));

        return result;
    }, [movies, selectedType, selectedYear, sortBy]);

    const topRated = useMemo(() => {
        return [...movies]
            .filter(m => m.imdbRating !== 'N/A')
            .sort((a, b) => parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0'))
            .slice(0, 6);
    }, [movies]);

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-[#161616]/95 backdrop-blur-md z-50 border-b border-white/5 flex items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/')}>
                        <div className="bg-[#ffb11e] p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                            <Play className="w-5 h-5 text-black fill-current" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">MOVIE<span className="text-[#ffb11e]">HUB</span></span>
                    </div>

                    <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="/" className="text-white hover:text-[#ffb11e] transition-colors">Home</Link>
                        <button className="hover:text-[#ffb11e] transition-colors">Movies</button>
                        <button className="hover:text-[#ffb11e] transition-colors">TV Series</button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#222] border-none rounded-full py-2 pl-4 pr-10 text-xs w-64 focus:ring-1 focus:ring-[#ffb11e] transition-all"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="w-4 h-4 text-gray-500 hover:text-[#ffb11e]" />
                        </button>
                    </form>

                    <button
                        onClick={handleRandom}
                        className="p-2.5 bg-[#ffb11e] text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-[#ffb11e]/20"
                        title="Random Movie"
                    >
                        <Shuffle className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-16">
                {(movies.length > 0 && !loading) ? (
                    <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden">
                        <img
                            src={movies[0].Poster !== 'N/A' ? movies[0].Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                            className="w-full h-full object-cover blur-sm opacity-40 scale-105"
                            alt="hero-bg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex items-end gap-12 z-10">
                            <div className="hidden md:block w-44 lg:w-56 shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 group">
                                <img src={movies[0].Poster} className="w-full transition-transform duration-500 group-hover:scale-110" alt="" />
                            </div>
                            <div className="flex-1 space-y-4 max-w-2xl">
                                <div className="flex items-center gap-2 text-[#ffb11e] text-xs font-bold uppercase tracking-widest">
                                    <TrendingUp className="w-4 h-4" />
                                    Featured Movie
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tighter drop-shadow-lg">{movies[0].Title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                                    <span className="flex items-center gap-1.5 bg-[#ffb11e] text-black px-2 py-0.5 rounded-md font-bold text-xs">
                                        <Star className="w-3.5 h-3.5 fill-current" /> {movies[0].imdbRating}
                                    </span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs">{movies[0].Year}</span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs uppercase">{movies[0].Type}</span>
                                </div>
                                <p className="text-gray-400 line-clamp-3 text-sm md:text-base leading-relaxed drop-shadow-md">{movies[0].Plot}</p>
                                <div className="flex items-center gap-4 pt-4">
                                    <Link href={`/movie/${movies[0].imdbID}`} className="bg-[#ffb11e] text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-[#ffb11e]/10">
                                        <Play className="w-5 h-5 fill-current" /> WATCH NOW
                                    </Link>
                                    <Link href={`/movie/${movies[0].imdbID}`} className="bg-white/10 backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-white/20 transition-all">
                                        <Info className="w-5 h-5" /> DETAILS
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="w-12 h-12 border-2 border-[#ffb11e] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Section: Grid */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-[#ffb11e] rounded-full" />
                                Latest Releases
                            </h2>

                            <div className="flex items-center gap-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-[#161616] border border-white/10 text-xs font-bold rounded-xl px-4 py-2 text-gray-300 outline-none focus:ring-2 focus:ring-[#ffb11e] appearance-none cursor-pointer"
                                >
                                    <option value="latest">LATEST</option>
                                    <option value="oldest">OLDEST</option>
                                    <option value="rating">TOP RATED</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-y-12 gap-x-6">
                                {filteredMovies.map((movie) => (
                                    <div key={movie.imdbID} className="group cursor-pointer">
                                        <Link href={`/movie/${movie.imdbID}`}>
                                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[#ffb11e]/5">
                                                <img
                                                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt={movie.Title}
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-[#ffb11e] rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                                                        <Play className="w-8 h-8 text-black fill-current" />
                                                    </div>
                                                </div>

                                                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                    <span className="bg-[#ffb11e] text-black text-[11px] font-black px-2 py-0.5 rounded shadow-lg uppercase">HD</span>
                                                    <span className="bg-white text-black text-[11px] font-black px-2 py-0.5 rounded shadow-lg uppercase">{movie.Type}</span>
                                                </div>

                                                {movie.imdbRating !== 'N/A' && (
                                                    <div className="absolute bottom-3 left-3 bg-[#111]/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-black border border-white/5">
                                                        <Star className="w-3.5 h-3.5 text-[#ffb11e] fill-current" />
                                                        {movie.imdbRating}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-[15px] font-black line-clamp-1 group-hover:text-[#ffb11e] transition-colors mb-1 tracking-tight">{movie.Title}</h3>
                                            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-bold uppercase tracking-wider">
                                                <span>{movie.Year}</span>
                                                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                                <span>{movie.Type}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Section: Sidebar */}
                    <aside className="w-full lg:w-[400px] space-y-10">
                        <section>
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-3 mb-8">
                                <TrendingUp className="text-[#ffb11e] w-6 h-6" />
                                TOP RATED
                            </h2>
                            <div className="bg-[#161616] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                                {topRated.map((movie, idx) => (
                                    <Link
                                        key={movie.imdbID}
                                        href={`/movie/${movie.imdbID}`}
                                        className="flex items-center gap-5 p-5 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group"
                                    >
                                        <div className={`w-8 flex-shrink-0 text-2xl font-black ${idx < 3 ? 'text-[#ffb11e]' : 'text-gray-700'}`}>0{idx + 1}</div>
                                        <div className="w-14 h-20 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 ring-1 ring-white/5 group-hover:ring-[#ffb11e]/20 transition-all">
                                            <img src={movie.Poster} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[15px] font-black line-clamp-1 group-hover:text-[#ffb11e] transition-colors">{movie.Title}</h4>
                                            <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-1.5 font-bold">
                                                <span className="flex items-center gap-1.5 text-[#ffb11e]"><Star className="w-3.5 h-3.5 fill-current" /> {movie.imdbRating}</span>
                                                <span>{movie.Year}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-[#ffb11e] transform group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-[#ffb11e] to-[#fcd34d] rounded-3xl p-8 text-black shadow-2xl shadow-[#ffb11e]/10">
                            <h3 className="text-2xl font-black leading-tight mb-3">Join our Community</h3>
                            <p className="text-sm font-bold opacity-80 mb-6 leading-relaxed">Get early access to movie reviews and exclusive cinematic content.</p>
                            <button className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl">
                                DISCORD COMMUNITY
                            </button>
                        </section>

                        <section className="bg-[#161616] rounded-3xl p-8 border border-white/5">
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-[#ffb11e]" />
                                COUNTRIES
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-widest">
                                {['USA', 'Japan', 'China', 'Korea', 'France', 'UK', 'India', 'Spain'].map(c => (
                                    <span key={c} className="bg-white/5 hover:bg-[#ffb11e] hover:text-black px-3 py-1.5 rounded-lg cursor-pointer transition-all border border-white/5">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#161616] border-t border-white/5 mt-20 py-20">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#ffb11e] p-2 rounded-xl">
                            <Play className="w-8 h-8 text-black fill-current" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter">MOVIE<span className="text-[#ffb11e]">HUB</span></span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-2xl text-center leading-relaxed font-medium">
                        Explore the vast world of cinema with MovieHub Masterpiece. We provide detailed information,
                        ratings, and summaries for all your favorite titles. Experience entertainment like never before.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 text-[13px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        <button className="hover:text-white transition-colors">PRIVACY</button>
                        <button className="hover:text-white transition-colors">TERMS</button>
                        <button className="hover:text-white transition-colors">CONTACT</button>
                        <button className="hover:text-white transition-colors">ADVERTISE</button>
                    </div>
                    <div className="pt-10 border-t border-white/5 w-full text-center">
                        <p className="text-gray-700 text-xs font-bold tracking-widest uppercase">© 2024 MOVIEHUB MASTERPIECE. DATA BY OMDB.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
