import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function ResetPassword() {
    // useSearchParams = baca query string dari URL
    // URL: /reset-password?token=abc123&email=dausyaf@gmail.com
    const [searchParams]    = useSearchParams()
    const navigate          = useNavigate()

    const [form, setForm]   = useState({
        token:                 searchParams.get('token') || '',
        email:                 searchParams.get('email') || '',
        password:              '',
        password_confirmation: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState(null)
    const [errors, setErrors]   = useState({})  // error per field

    // Kalau tidak ada token di URL → link tidak valid
    useEffect(() => {
        if (!form.token || !form.email) {
            setError('Link reset password tidak valid atau sudah kadaluarsa.')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setErrors({})

        try {
            await api.post('/reset-password', form)
            // Sukses → redirect ke login dengan pesan sukses
            navigate('/login?reset=success')
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {})
            } else {
                setError(err.response?.data?.message || 'Terjadi kesalahan')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Reset Password
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Masukkan password baru kamu.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                        {!form.token && (
                            <div className="mt-2">
                                <Link to="/forgot-password"
                                    className="text-red-700 underline">
                                    Minta link baru
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email — readonly, diambil dari URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            readOnly
                            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        {/* readOnly karena sudah otomatis dari URL */}
                    </div>

                    {/* Password baru */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password Baru
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={`w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password ? 'border-red-400' : 'border-gray-300'
                            }`}
                            placeholder="Minimal 8 karakter"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                        )}
                    </div>

                    {/* Konfirmasi password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ulangi password baru"
                            required
                        />
                    </div>

                    <button type="submit"
                        disabled={loading || !form.token}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium transition-colors">
                        {loading ? 'Menyimpan...' : 'Reset Password'}
                    </button>
                </form>

            </div>
        </div>
    )
}