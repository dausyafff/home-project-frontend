import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function ProjectDetail() {
    const { slug }            = useParams() // ambil :slug dari URL
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]   = useState(null)
    const { token }           = useAuth()
    const navigate            = useNavigate()

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${slug}`)
                setProject(res.data.data)
            } catch (err) {
                setError('Project tidak ditemukan')
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [slug])

    const handleDelete = async () => {
        if (!window.confirm('Yakin mau hapus project ini?')) return
        try {
            await api.delete(`/projects/${project.id}`)
            navigate('/projects')
        } catch (e) {
            alert('Gagal menghapus project')
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-400 text-lg mb-4">{error}</p>
                <Link to="/projects" className="text-blue-500 hover:underline text-sm">
                    ← Kembali ke Projects
                </Link>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <Link to="/" className="hover:text-blue-500">Home</Link>
                    <span>/</span>
                    <Link to="/projects" className="hover:text-blue-500">Projects</Link>
                    <span>/</span>
                    <span className="text-gray-600">{project.title}</span>
                </div>

                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {project.title}
                                </h1>
                                {project.is_featured && (
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                                        Featured
                                    </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    project.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm">
                                {new Date(project.created_at).toLocaleDateString('id-ID', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Admin actions */}
                        {token && (
                            <div className="flex gap-2">
                                <Link
                                    to="/dashboard"
                                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors">
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="text-sm bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-lg transition-colors">
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-2">Tech Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tech_stack.map((tech) => (
                                    <span key={tech}
                                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4">
                        {project.github_url && (
                            <a href={project.github_url}
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg text-sm transition-colors">
                                GitHub →
                            </a>
                        )}
                        {project.live_url && (
                            <a href={project.live_url}
                                target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm transition-colors">
                                Live Demo →
                            </a>
                        )}
                    </div>
                </div>

                {/* Back */}
                <Link to="/projects"
                    className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                    ← Kembali ke semua project
                </Link>

            </div>
        </div>
    )
}