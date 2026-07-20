import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
    const [email, setEmail]     = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent]       = useState(false)  // sudah terkirim atau belum
    const [error, setError]     = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await api.post('/forgot-password', { email })
            setSent(true)  // ganti tampilan ke "email terkirim"
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan')
        } finally {
            setLoading(false)
        }
    }

    // Kalau email sudah terkirim, tampilkan pesan konfirmasi
    // bukan form lagi
    if (sent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md text-center">
                    <div className="text-5xl mb-4">📧</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Cek email kamu!
                    </h2>
                    <p className="text-gray-500 text-sm mb-2">
                        Link reset password sudah dikirim ke:
                    </p>
                    <p className="font-medium text-blue-600 mb-6">{email}</p>
                    <p className="text-gray-400 text-xs mb-6">
                        Link berlaku selama 60 menit.
                        Cek folder spam kalau tidak ada di inbox.
                    </p>
                    <Link to="/login"
                        className="text-blue-500 hover:underline text-sm">
                        ← Kembali ke Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Lupa Password
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Masukkan email kamu, kami akan kirimkan link untuk reset password.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="dausyaf@gmail.com"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg font-medium transition-colors">
                        {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Ingat password?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}