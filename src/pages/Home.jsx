import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlobalSearch from '../components/GlobalSearch'

export default function Home() {
    const { token, user } = useAuth()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-20">

                {token ? (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         // ── Sudah login: tampilan admin ───────────────
                    <div>
                        {/* Greeting personal */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Hai, {user?.name}! 👋
                                    </h1>
                                    <p className="text-gray-500 text-sm">{user?.email}</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                Selamat datang kembali di dashboard portfolio kamu.
                                Kelola projects, skills, dan posts dari sini.
                            </p>
                        </div>

                        {/* Shortcut cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link to="/dashboard"
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                                <div className="text-3xl mb-3">🗂️</div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-500 transition-colors">
                                    Kelola Projects
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Tambah, edit, atau hapus project portfolio
                                </p>
                            </Link>

                            <Link to="/projects"
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                                <div className="text-3xl mb-3">👁️</div>
                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-500 transition-colors">
                                    Lihat Portfolio
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Tampilan portfolio seperti yang dilihat pengunjung
                                </p>
                            </Link>

                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="text-3xl mb-3">⚙️</div>
                                <h3 className="font-semibold text-gray-800">
                                    Coming Soon
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Fitur tambahan akan hadir segera
                                </p>
                            </div>
                        </div>
                    </div>

                ) : (
                    // ── Belum login: tampilan publik ──────────────
                    <div>
                        {/* Hero */}
                        <div className="mt-10">
                            <GlobalSearch />
                        </div>
                        <div className="text-center mb-16">
                            <div className="inline-block bg-blue-50 text-blue-600 text-sm px-4 py-1.5 rounded-full mb-4">
                                Available for work 🟢
                            </div>
                            <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                                Halo, Semuanya{' '} 👋
                                {/* <span className="text-blue-500">Dausyaf</span>  */}
                            </h1>
                            <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
                                Laravel & React Developer berbasis di Surabaya,
                                Jawa Timur. Fokus membangun API yang clean dan
                                sistem yang scalable.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link to="/projects"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                    Lihat Projects →
                                </Link>
                                <a href="https://github.com/dausyaf"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="border border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-500 px-6 py-3 rounded-lg font-medium transition-colors">
                                    GitHub
                                </a>
                            </div>
                        </div>

                        {/* Tech stack */}
                        <div className="text-center mb-16">
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">
                                Tech Stack
                            </p>
                            <div className="flex justify-center flex-wrap gap-3">
                                {['Laravel', 'PHP', 'React', 'MySQL', 'Redis', 'Docker', 'Git'].map((tech) => (
                                    <span key={tech}
                                        className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm shadow-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Stats sederhana */}
                        <div className="grid grid-cols-3 gap-6 text-center">
                            {[
                                { number: '3+', label: 'Projects' },
                                { number: '1+', label: 'Tahun Belajar' },
                                { number: '10+', label: 'Tech Stack' },
                            ].map((stat) => (
                                <div key={stat.label}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="text-3xl font-bold text-blue-500 mb-1">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-500 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}