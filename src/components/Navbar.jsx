import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Navbar() {
    const { token, user, logout } = useAuth()
    const navigate = useNavigate()
    const [loggingOut, setLoggingOut] = useState(false)
    const [menuOpen, setMenuOpen]     = useState(false) // state hamburger

    const handleLogout = async () => {
        const konfirmasi = window.confirm('Apakah kamu yakin ingin logout?')
        if (!konfirmasi) return

        setLoggingOut(true)
        try {
            await api.post('/logout')
        } catch (e) {}

        setTimeout(() => {
            logout()
            navigate('/login')
            setLoggingOut(false)
            setMenuOpen(false)
        }, 600)
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-gray-800" onClick={() => setMenuOpen(false)}>
                    dausyaf<span className="text-blue-500">.dev</span>
                </Link>

                {/* Hamburger button — hanya tampil di mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-600 p-2"
                    aria-label="Menu">
                    {menuOpen ? (
                        // Icon X
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        // Icon hamburger
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Menu — desktop: flex horizontal, mobile: hidden by default */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                        Home
                    </Link>
                    <Link to="/projects" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                        Projects
                    </Link>

                    {token ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-blue-700 text-sm font-medium whitespace-nowrap">
                                    Hai, {user?.name}!
                                </span>
                            </div>
                            <Link to="/dashboard" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-500 disabled:text-gray-400 px-4 py-1.5 rounded-lg text-sm transition-all duration-300 flex items-center gap-2">
                                {loggingOut ? (
                                    <>
                                        <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></span>
                                        Logout...
                                    </>
                                ) : 'Logout'}
                            </button>
                        </div>
                    ) : (
                        <Link to="/login"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile menu — dropdown ke bawah, hanya tampil kalau menuOpen=true */}
            {menuOpen && (
                <div className="md:hidden mt-4 pb-2 flex flex-col gap-3 border-t border-gray-100 pt-4">
                    <Link to="/" onClick={() => setMenuOpen(false)}
                        className="text-gray-600 hover:text-blue-500 text-sm">
                        Home
                    </Link>
                    <Link to="/projects" onClick={() => setMenuOpen(false)}
                        className="text-gray-600 hover:text-blue-500 text-sm">
                        Projects
                    </Link>

                    {token ? (
                        <>
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg w-fit">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-blue-700 text-sm font-medium">
                                    Hai, {user?.name}!
                                </span>
                            </div>
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                                className="text-gray-600 hover:text-blue-500 text-sm">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg text-sm w-fit flex items-center gap-2">
                                {loggingOut ? (
                                    <>
                                        <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></span>
                                        Logout...
                                    </>
                                ) : 'Logout'}
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-fit">
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}