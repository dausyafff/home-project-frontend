import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', password_confirmation: ''
    })
    const [error, setError]   = useState(null)
    const [errors, setErrors] = useState({}) // error per field
    const [loading, setLoading] = useState(false)

    const { login }  = useAuth()
    const navigate   = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setErrors({})

        try {
            const response = await api.post('/register', form)
            const { data } = response.data
            login(data.user, data.token)
            navigate('/')
        } catch (err) {
            // Kalau 422 → error validasi per field
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {})
            } else {
                setError(err.response?.data?.message || 'Register gagal')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Daftar Akun</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Buat akun untuk mengelola portfolio kamu
                </p>

                {/* Error umum */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Dausyaf"
                            required
                        />
                        {/* Error per field */}
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="dausyaf@gmail.com"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Minimal 8 karakter"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                        )}
                    </div>

                    {/* Konfirmasi Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Konfirmasi Password
                        </label>
                        <input
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ulangi password"
                            required
                        />
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium transition-colors">
                        {loading ? 'Mendaftar...' : 'Daftar'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )
}