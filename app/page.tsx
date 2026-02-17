'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search, Star, Info, Play, Shuffle,
    TrendingUp, ChevronRight, Menu, Globe, X, Flame, Tv, Film,
    Heart, Sparkles, ArrowRight, Clapperboard
} from 'lucide-react';

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
    'tt0111161', 'tt0468569', 'tt0137523', 'tt0110912', 'tt1375666',
    'tt0068646', 'tt0109830', 'tt0120338', 'tt0120737', 'tt0076759',
];

const GENRE_TABS = [
    { label: 'Action', icon: Flame, query: 'action' },
    { label: 'Comedy', icon: Sparkles, query: 'comedy' },
    { label: 'Drama', icon: Film, query: 'drama' },
    { label: 'Thriller', icon: Clapperboard, query: 'thriller' },
    { label: 'Horror', icon: Heart, query: 'horror' },
    { label: 'Sci-Fi', icon: Globe, query: 'sci-fi' },
    { label: 'Romance', icon: Heart, query: 'romance' },
    { label: 'Adventure', icon: TrendingUp, query: 'adventure' },
];

const QUICK_SEARCHES = ['Marvel', 'Batman', 'Star Wars', 'Harry Potter', 'Lord of the Rings', 'James Bond'];

export default function Page() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [activeGenre, setActiveGenre] = useState('action');

    // Filters
    const [selectedType, setSelectedType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('latest');

    useEffect(() => {
        fetchMovies('action');
    }, []);

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
        setActiveGenre('');
        fetchMovies(searchTerm);
        setMobileSearchOpen(false);
    };

    const handleGenreClick = (genre: typeof GENRE_TABS[0]) => {
        setActiveGenre(genre.query);
        setSearchTerm('');
        fetchMovies(genre.query);
    };

    const handleQuickSearch = (term: string) => {
        setSearchTerm(term);
        setActiveGenre('');
        fetchMovies(term);
        setMobileSearchOpen(false);
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

    const filteredMovies = useMemo(() => {
        let result = [...movies];
        if (selectedType !== 'all') result = result.filter(m => m.Type === selectedType);

        if (sortBy === 'latest') result.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        else if (sortBy === 'oldest') result.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        else if (sortBy === 'rating') result.sort((a, b) => parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0'));

        return result;
    }, [movies, selectedType, sortBy]);

    const topRated = useMemo(() => {
        return [...movies]
            .filter(m => m.imdbRating !== 'N/A')
            .sort((a, b) => parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0'))
            .slice(0, 6);
    }, [movies]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* ===== NAVIGATION ===== */}
            <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-4 md:px-8 animate-slide-down">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => router.push('/')}>
                        <div className="bg-[#ffb11e] p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#ffb11e]/20">
                            <Play className="w-5 h-5 text-black fill-current" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">
                            MOVIE<span className="text-[#ffb11e]">HUB</span>
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-1 text-sm font-semibold">
                        <Link href="/" className="text-white bg-white/5 px-4 py-2 rounded-xl hover:text-[#ffb11e] transition-colors">Home</Link>
                        <button onClick={() => { setSearchTerm(''); fetchMovies('movie'); setActiveGenre(''); }}
                            className="text-gray-400 px-4 py-2 rounded-xl hover:text-[#ffb11e] hover:bg-white/5 transition-all">Movies</button>
                        <button onClick={() => { setSearchTerm(''); fetchMovies('series'); setActiveGenre(''); }}
                            className="text-gray-400 px-4 py-2 rounded-xl hover:text-[#ffb11e] hover:bg-white/5 transition-all">TV Series</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search movies, series..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm w-72 focus:ring-2 focus:ring-[#ffb11e]/50 focus:border-[#ffb11e]/50 transition-all placeholder:text-gray-600 font-medium"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="w-4 h-4 text-gray-500 hover:text-[#ffb11e] transition-colors" />
                        </button>
                    </form>

                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className="md:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <Search className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Random Button */}
                    <button
                        onClick={handleRandom}
                        className="p-2.5 bg-[#ffb11e] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#ffb11e]/20 animate-pulse-glow"
                        title="Random Movie"
                    >
                        <Shuffle className="w-4 h-4" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="lg:hidden p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                        <Menu className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </nav>

            {/* ===== MOBILE SEARCH BAR ===== */}
            {mobileSearchOpen && (
                <div className="fixed top-16 left-0 right-0 z-40 glass p-4 animate-slide-down md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search movies, series..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-[#ffb11e]/50 transition-all placeholder:text-gray-600 font-medium"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Search className="w-4 h-4 text-gray-500" />
                        </button>
                    </form>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {QUICK_SEARCHES.slice(0, 4).map(term => (
                            <button key={term} onClick={() => handleQuickSearch(term)}
                                className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-[#ffb11e] hover:text-black transition-all uppercase tracking-wider">
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== MOBILE MENU ===== */}
            {mobileMenuOpen && (
                <>
                    <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
                    <div className="mobile-menu-panel">
                        <div className="p-6 space-y-8">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-black tracking-tighter">
                                    MOVIE<span className="text-[#ffb11e]">HUB</span>
                                </span>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <Link href="/" onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white font-bold text-sm">
                                    <Flame className="w-4 h-4 text-[#ffb11e]" /> Home
                                </Link>
                                <button onClick={() => { fetchMovies('movie'); setActiveGenre(''); setMobileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 font-bold text-sm transition-all">
                                    <Film className="w-4 h-4" /> Movies
                                </button>
                                <button onClick={() => { fetchMovies('series'); setActiveGenre(''); setMobileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 font-bold text-sm transition-all">
                                    <Tv className="w-4 h-4" /> TV Series
                                </button>
                                <button onClick={() => { handleRandom(); setMobileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 font-bold text-sm transition-all hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/20">
                                    <Shuffle className="w-4 h-4" /> Random Movie
                                </button>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">BROWSE BY GENRE</h4>
                                <div className="space-y-1">
                                    {GENRE_TABS.map(genre => (
                                        <button key={genre.query}
                                            onClick={() => { handleGenreClick(genre); setMobileMenuOpen(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeGenre === genre.query ? 'bg-[#ffb11e] text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                            <genre.icon className="w-4 h-4" /> {genre.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">QUICK SEARCH</h4>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_SEARCHES.map(term => (
                                        <button key={term} onClick={() => { handleQuickSearch(term); setMobileMenuOpen(false); }}
                                            className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-lg text-gray-400 hover:bg-[#ffb11e] hover:text-black transition-all uppercase tracking-wider">
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ===== HERO SECTION ===== */}
            <div className="pt-16">
                {(movies.length > 0 && !loading) ? (
                    <div className="relative h-[420px] md:h-[550px] w-full overflow-hidden animate-fade-in">
                        <img
                            src={movies[0].Poster !== 'N/A' ? movies[0].Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                            className="w-full h-full object-cover blur-sm opacity-30 scale-105"
                            alt="hero-bg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex items-end gap-10 z-10">
                            <div className="hidden md:block w-40 lg:w-52 shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 group animate-scale-in">
                                <img src={movies[0].Poster} className="w-full transition-transform duration-700 group-hover:scale-110" alt="" />
                            </div>
                            <div className="flex-1 space-y-4 max-w-2xl animate-slide-up">
                                <div className="flex items-center gap-2 text-[#ffb11e] text-[11px] font-black uppercase tracking-[0.2em]">
                                    <Flame className="w-4 h-4" />
                                    <span>Spotlight</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tighter drop-shadow-lg">
                                    {movies[0].Title}
                                </h1>
                                <div className="flex items-center gap-3 text-sm font-semibold flex-wrap">
                                    {movies[0].imdbRating && movies[0].imdbRating !== 'N/A' && (
                                        <span className="flex items-center gap-1.5 bg-[#ffb11e] text-black px-2.5 py-1 rounded-lg font-black text-xs shadow-lg shadow-[#ffb11e]/20">
                                            <Star className="w-3.5 h-3.5 fill-current" /> {movies[0].imdbRating}
                                        </span>
                                    )}
                                    <span className="bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs text-gray-300">{movies[0].Year}</span>
                                    <span className="bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs uppercase text-gray-300">{movies[0].Type}</span>
                                    {movies[0].Genre && <span className="text-xs text-gray-500 hidden sm:inline">{movies[0].Genre}</span>}
                                </div>
                                {movies[0].Plot && movies[0].Plot !== 'N/A' && (
                                    <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed max-w-xl">{movies[0].Plot}</p>
                                )}
                                <div className="flex items-center gap-3 pt-2 flex-wrap">
                                    <Link href={`/movie/${movies[0].imdbID}`}
                                        className="bg-[#ffb11e] text-black px-7 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-white transition-all active:scale-95 shadow-xl shadow-[#ffb11e]/15">
                                        <Play className="w-4 h-4 fill-current" /> WATCH NOW
                                    </Link>
                                    <Link href={`/movie/${movies[0].imdbID}`}
                                        className="glass-light px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-all text-gray-300">
                                        <Info className="w-4 h-4" /> DETAILS
                                    </Link>
                                    <button
                                        onClick={handleRandom}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-7 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 hover:from-purple-500 hover:to-pink-500 transition-all active:scale-95 shadow-xl shadow-purple-600/20"
                                    >
                                        <Shuffle className="w-4 h-4" /> RANDOM MOVIE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-14 h-14 border-2 border-[#ffb11e] border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] animate-pulse">Loading movies...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== GENRE TABS ===== */}
            <div className="sticky top-16 z-30 glass">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                        {GENRE_TABS.map(genre => {
                            const Icon = genre.icon;
                            return (
                                <button
                                    key={genre.query}
                                    onClick={() => handleGenreClick(genre)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${activeGenre === genre.query
                                        ? 'bg-[#ffb11e] text-black shadow-lg shadow-[#ffb11e]/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {genre.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Section: Grid */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <div className="w-1.5 h-7 bg-[#ffb11e] rounded-full" />
                                {activeGenre ? `${activeGenre.charAt(0).toUpperCase() + activeGenre.slice(1)} Movies` : 'Search Results'}
                            </h2>

                            <div className="flex items-center gap-3">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="bg-white/5 border border-white/10 text-[11px] font-bold rounded-xl px-3 py-2 text-gray-400 outline-none focus:ring-2 focus:ring-[#ffb11e]/50 appearance-none cursor-pointer"
                                >
                                    <option value="all">ALL TYPES</option>
                                    <option value="movie">MOVIES</option>
                                    <option value="series">SERIES</option>
                                    <option value="game">GAMES</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white/5 border border-white/10 text-[11px] font-bold rounded-xl px-3 py-2 text-gray-400 outline-none focus:ring-2 focus:ring-[#ffb11e]/50 appearance-none cursor-pointer"
                                >
                                    <option value="latest">LATEST</option>
                                    <option value="oldest">OLDEST</option>
                                    <option value="rating">TOP RATED</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="aspect-[2/3] bg-white/[0.03] rounded-2xl animate-shimmer" />
                                        <div className="h-3 bg-white/[0.03] rounded-lg w-3/4 animate-shimmer" />
                                        <div className="h-2.5 bg-white/[0.03] rounded-lg w-1/2 animate-shimmer" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                                    <Search className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-500 font-bold text-sm">{error}</p>
                                <div className="flex flex-wrap gap-2 justify-center max-w-md">
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2 w-full text-center">Try searching for:</span>
                                    {QUICK_SEARCHES.map(term => (
                                        <button key={term} onClick={() => handleQuickSearch(term)}
                                            className="text-[11px] font-bold bg-white/5 px-4 py-2 rounded-xl text-gray-400 hover:bg-[#ffb11e] hover:text-black transition-all">
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-5 gap-y-10 stagger-children">
                                {filteredMovies.map((movie) => (
                                    <div key={movie.imdbID} className="group cursor-pointer">
                                        <Link href={`/movie/${movie.imdbID}`}>
                                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[#ffb11e]/10 group-hover:shadow-2xl border border-white/5 group-hover:border-[#ffb11e]/20">
                                                <img
                                                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    alt={movie.Title}
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                                    <div className="w-14 h-14 bg-[#ffb11e] rounded-full flex items-center justify-center scale-50 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-[#ffb11e]/30">
                                                        <Play className="w-6 h-6 text-black fill-current ml-0.5" />
                                                    </div>
                                                </div>

                                                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                                                    <span className="bg-[#ffb11e] text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider">HD</span>
                                                    <span className="bg-white/90 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider">{movie.Type}</span>
                                                </div>

                                                {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                                                    <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black border border-white/10">
                                                        <Star className="w-3 h-3 text-[#ffb11e] fill-current" />
                                                        {movie.imdbRating}
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-[13px] font-bold line-clamp-1 group-hover:text-[#ffb11e] transition-colors mb-0.5">{movie.Title}</h3>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-600 font-semibold">
                                                <span>{movie.Year}</span>
                                                <div className="w-0.5 h-0.5 bg-gray-700 rounded-full" />
                                                <span className="uppercase">{movie.Type}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Section: Sidebar */}
                    <aside className="w-full lg:w-[380px] space-y-8">
                        {/* Top Rated Section */}
                        <section className="animate-slide-up">
                            <h2 className="text-lg font-black tracking-tight flex items-center gap-3 mb-6">
                                <TrendingUp className="text-[#ffb11e] w-5 h-5" />
                                TOP RATED
                            </h2>
                            <div className="bg-[#141414] rounded-2xl overflow-hidden border border-white/5">
                                {topRated.map((movie, idx) => (
                                    <Link
                                        key={movie.imdbID}
                                        href={`/movie/${movie.imdbID}`}
                                        className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-all border-b border-white/5 last:border-0 group"
                                    >
                                        <div className={`w-7 text-lg font-black tabular-nums ${idx < 3 ? 'text-[#ffb11e]' : 'text-gray-700'}`}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                        <div className="w-12 h-16 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 ring-1 ring-white/5 group-hover:ring-[#ffb11e]/30 transition-all">
                                            <img src={movie.Poster} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" loading="lazy" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-bold line-clamp-1 group-hover:text-[#ffb11e] transition-colors">{movie.Title}</h4>
                                            <div className="flex items-center gap-2.5 text-[11px] text-gray-500 mt-1 font-semibold">
                                                <span className="flex items-center gap-1 text-[#ffb11e]">
                                                    <Star className="w-3 h-3 fill-current" /> {movie.imdbRating}
                                                </span>
                                                <span>{movie.Year}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-[#ffb11e] group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Quick Search Tags */}
                        <section className="bg-[#141414] rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#ffb11e]" />
                                POPULAR SEARCHES
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_SEARCHES.map(term => (
                                    <button key={term} onClick={() => handleQuickSearch(term)}
                                        className="text-[10px] font-bold bg-white/5 px-3 py-2 rounded-lg text-gray-400 hover:bg-[#ffb11e] hover:text-black transition-all uppercase tracking-wider border border-white/5 hover:border-transparent">
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Community CTA */}
                        <section className="relative bg-gradient-to-br from-[#ffb11e] to-[#f59e0b] rounded-2xl p-7 text-black overflow-hidden shadow-2xl shadow-[#ffb11e]/10">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-xl" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-black leading-tight mb-2">Join the Community</h3>
                                <p className="text-sm font-semibold opacity-70 mb-5 leading-relaxed">Get early access to reviews and exclusive cinematic content.</p>
                                <button className="w-full bg-black text-white font-black py-3.5 rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl text-sm">
                                    JOIN DISCORD <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </section>

                        {/* Countries */}
                        <section className="bg-[#141414] rounded-2xl p-6 border border-white/5">
                            <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[#ffb11e]" />
                                COUNTRIES
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['USA', 'Japan', 'China', 'Korea', 'France', 'UK', 'India', 'Spain'].map(c => (
                                    <span key={c}
                                        className="bg-white/5 hover:bg-[#ffb11e] hover:text-black px-3 py-1.5 rounded-lg cursor-pointer transition-all text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-white/5 hover:border-transparent">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="bg-[#0d0d0d] border-t border-white/5 mt-16 py-16">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col items-center gap-8">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-[#ffb11e] p-2 rounded-xl shadow-lg shadow-[#ffb11e]/20">
                            <Play className="w-7 h-7 text-black fill-current" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            MOVIE<span className="text-[#ffb11e]">HUB</span>
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xl text-center leading-relaxed font-medium">
                        Discover the vast world of cinema. Detailed information, ratings, and summaries for all your favorite titles.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        <button className="hover:text-[#ffb11e] transition-colors">Privacy</button>
                        <button className="hover:text-[#ffb11e] transition-colors">Terms</button>
                        <button className="hover:text-[#ffb11e] transition-colors">Contact</button>
                        <button className="hover:text-[#ffb11e] transition-colors">Advertise</button>
                    </div>
                    <div className="pt-8 border-t border-white/5 w-full text-center">
                        <p className="text-gray-700 text-[10px] font-bold tracking-[0.3em] uppercase">© 2025 MovieHub Masterpiece • Data by OMDb</p>
                    </div>
                </div>
            </footer>

            {/* ===== FLOATING RANDOM BUTTON ===== */}
            <button
                onClick={handleRandom}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-110 active:scale-95 transition-all group"
                title="Watch Random Movie"
            >
                <Shuffle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-white/10 shadow-xl">
                    🎲 Watch Random Movie
                </span>
            </button>
        </div>
    );
}
