import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Navbar() {
    const { token, user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        const konfirmasi = window.confirm('Apakah kamu yakin ingin logout?')
        if (!konfirmasi) return

        try {
            await api.post('/logout')
        } catch (e) {
            // tetap logout meski request gagal
        } finally {
            logout()
            navigate('/')
        }
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-gray-800">
                    dausyaf<span className="text-blue-500">.dev</span>
                </Link>

                {/* Menu */}
                <div className="flex items-center gap-6">
                    <Link to="/"
                        className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                        Home
                    </Link>
                    <Link to="/projects"
                        className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                        Projects
                    </Link>

                    {token ? (
                        // ── Sudah login ──────────────────────────
                        <div className="flex items-center gap-4">

                            {/* Greeting */}
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-blue-700 text-sm font-medium">
                                    Hai, {user?.name}!
                                </span>
                            </div>

                            <Link to="/dashboard"
                                className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                                Dashboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-1.5 rounded-lg text-sm transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        // ── Belum login ───────────────────────────
                        <Link to="/login"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}