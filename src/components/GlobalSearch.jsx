import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function GlobalSearch() {
    const [query, setQuery]         = useState('')
    const [results, setResults]     = useState(null)  // null = belum search, {} = sudah search
    const [loading, setLoading]     = useState(false)
    const [isOpen, setIsOpen]       = useState(false)  // dropdown terbuka atau tidak
    const wrapperRef                = useRef(null)      // untuk deteksi klik di luar
    const navigate                  = useNavigate()

    // ── Debounce search ──────────────────────────────────
    useEffect(() => {
        if (query.length < 2) {
            setResults(null)
            setIsOpen(false)
            return
        }

        const timeout = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await api.get('/search', { params: { q: query } })
                setResults(res.data.data)
                setIsOpen(true)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(timeout)
    }, [query])

    // ── Tutup dropdown kalau klik di luar ────────────────
    // Ini teknik umum untuk "click outside to close"
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // ── Klik hasil pencarian ─────────────────────────────
    const handleResultClick = (item) => {
        setIsOpen(false)
        setQuery('')
        navigate(item.url)
    }

    // ── Total hasil ──────────────────────────────────────
    const hasResults = results && results.total > 0
    const noResults  = results && results.total === 0

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">

            {/* Search input */}
            <div className="relative">
                {/* Icon search */}
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results && setIsOpen(true)}
                    placeholder="Cari project, skill, atau artikel..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                {/* Loading spinner */}
                {loading && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-500 rounded-full animate-spin"></span>
                    </div>
                )}
            </div>

            {/* Dropdown hasil */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">

                    {/* Tidak ada hasil */}
                    {noResults && (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                            Tidak ada hasil untuk "<span className="font-medium text-gray-600">{query}</span>"
                        </div>
                    )}

                    {/* Ada hasil */}
                    {hasResults && (
                        <div>
                            {/* Header total */}
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-400">
                                    {results.total} hasil untuk "<span className="text-gray-600">{query}</span>"
                                </p>
                            </div>

                            {/* Section Projects */}
                            {results.projects.length > 0 && (
                                <div>
                                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                                        Projects
                                    </p>
                                    {results.projects.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleResultClick(item)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left">

                                            {/* Thumbnail kecil atau placeholder */}
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} alt={item.title}
                                                        className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-gray-300 text-xs">🗂</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {item.subtitle}
                                                </p>
                                                {/* Tech stack pills kecil */}
                                                {item.tech_stack && item.tech_stack.length > 0 && (
                                                    <div className="flex gap-1 mt-1 flex-wrap">
                                                        {item.tech_stack.slice(0, 3).map((tech) => (
                                                            <span key={tech}
                                                                className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Link eksternal kalau ada */}
                                            <div className="flex gap-2 flex-shrink-0">
                                                {item.github_url && (
                                                    <a href={item.github_url}
                                                        target="_blank" rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                                                        GitHub
                                                    </a>
                                                )}
                                                {item.live_url && (
                                                    <a href={item.live_url}
                                                        target="_blank" rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-xs text-blue-400 hover:text-blue-600 transition-colors">
                                                        Live
                                                    </a>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Section Skills */}
                            {results.skills.length > 0 && (
                                <div>
                                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                                        Skills
                                    </p>
                                    {results.skills.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleResultClick(item)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left">
                                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-500 text-sm">⚡</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Section Posts */}
                            {results.posts.length > 0 && (
                                <div>
                                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                                        Artikel
                                    </p>
                                    {results.posts.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleResultClick(item)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left">
                                            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                <span className="text-purple-500 text-sm">📝</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                                                {item.subtitle && (
                                                    <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}