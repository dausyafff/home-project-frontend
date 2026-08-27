import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState(null)
    const [loading, setLoading]   = useState(false)

    const { login }  = useAuth()
    const navigate    = useNavigate()
    const [searchParams] = useSearchParams()

        // Tambah state untuk pesan sukses:
    const [successMessage, setSuccessMessage] = useState(
        searchParams.get('reset') === 'success'
            ? 'Password berhasil direset! Silakan login dengan password baru.'
            : null
    )
    // Cek kalau diarahkan ke sini karena token expired
    useEffect(() => {
        if (searchParams.get('expired') === 'true') {
            setError('Sesi kamu telah berakhir. Silakan login kembali.')
        }
        if (searchParams.get('error') === 'oauth_failed') {
            setError('Login Google gagal. Silakan coba lagi.')
        }
    }, [searchParams])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await api.post('/login', { email, password })
            const { data } = response.data
            login(data.user, data.token)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login gagal')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Masuk untuk mengelola portfolio kamu
                </p>

                {error && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {/* Taruh di bawah field password, sebelum tombol submit */}
                    <div className="flex justify-end">
                        <Link to="/forgot-password"
                            className="text-sm text-blue-500 hover:underline">
                            Lupa password?
                        </Link>
                    </div>

                        {/* Divider */}
                    <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-xs text-gray-400">atau</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Tombol Google */}
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                // Ambil URL Google dari backend
                                const res = await api.get('/auth/google')
                                // Redirect browser ke URL Google
                                window.location.href = res.data.data.url
                            } catch (e) {
                                setError('Gagal memulai login Google')
                            }
                        }}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                        {/* Google Logo SVG */}
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
                        </svg>
                        Lanjutkan dengan Google
                    </button>

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium transition-colors">
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">Daftar</Link>
                </p>
            </div>
        </div>
    )
}