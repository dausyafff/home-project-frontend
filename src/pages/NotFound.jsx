import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-blue-500 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Halaman tidak ditemukan
                </h2>
                <p className="text-gray-500 mb-8">
                    Halaman yang kamu cari tidak ada atau sudah dipindahkan.
                </p>
                <Link to="/"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Kembali ke Home
                </Link>
            </div>
        </div>
    )
}