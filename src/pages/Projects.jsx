import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading]   = useState(true)
    const [search, setSearch]     = useState('')
    const [pagination, setPagination] = useState(null)
    const [page, setPage]         = useState(1)

    const fetchProjects = async (searchVal = '', pageVal = 1) => {
        setLoading(true)
        try {
            const response = await api.get('/projects', {
                params: {
                    search: searchVal,
                    page: pageVal,
                    per_page: 6,
                }
            })
            const result = response.data.data
            setProjects(result.data)
            setPagination(result)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Fetch saat pertama load
    useEffect(() => {
        fetchProjects(search, page)
    }, [page]) // re-fetch kalau page berubah

    // Search dengan delay — tidak fetch setiap ketikan
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1)
            fetchProjects(search, 1)
        }, 500) // tunggu 500ms setelah user berhenti ketik

        return () => clearTimeout(timeout) // cancel kalau user masih ketik
    }, [search])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Projects</h1>
                    <p className="text-gray-500">Kumpulan project yang pernah saya kerjakan</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Cari project..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        {search ? `Tidak ada project dengan kata "${search}"` : 'Belum ada project'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                            ← Prev
                        </button>

                        <span className="text-sm text-gray-500">
                            Halaman {pagination.current_page} dari {pagination.last_page}
                        </span>

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === pagination.last_page}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                            Next →
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}