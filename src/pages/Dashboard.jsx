import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ProjectCard from '../components/ProjectCard'

export default function Dashboard() {
    const { user } = useAuth()

    const [projects, setProjects]     = useState([])
    const [loading, setLoading]       = useState(true)
    const [showForm, setShowForm]     = useState(false)
    const [editProject, setEditProject] = useState(null) // null = create, object = edit
    const [form, setForm]             = useState({
        title: '', description: '', tech_stack: '',
        github_url: '', live_url: '', status: 'active', is_featured: false
    })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage]       = useState(null)

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await api.get('/projects', { params: { per_page: 100 } })
            setProjects(res.data.data.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchProjects() }, [])

    // Reset form ke nilai awal
    const resetForm = () => {
        setForm({
            title: '', description: '', tech_stack: '',
            github_url: '', live_url: '', status: 'active', is_featured: false
        })
        setEditProject(null)
        setShowForm(false)
    }

    // Klik tombol Edit → isi form dengan data project
    const handleEdit = (project) => {
        setEditProject(project)
        setForm({
            title:       project.title,
            description: project.description,
            tech_stack:  project.tech_stack?.join(', ') || '',
            github_url:  project.github_url || '',
            live_url:    project.live_url || '',
            status:      project.status,
            is_featured: project.is_featured,
        })
        setShowForm(true)
    }

    // Submit form — create atau update
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        // tech_stack dari string "Laravel, React" → array ["Laravel", "React"]
        const payload = {
            ...form,
            tech_stack: form.tech_stack
                ? form.tech_stack.split(',').map(t => t.trim())
                : [],
        }

        try {
            if (editProject) {
                // Update
                await api.put(`/projects/${editProject.id}`, payload)
                setMessage('Project berhasil diupdate!')
            } else {
                // Create
                await api.post('/projects', payload)
                setMessage('Project berhasil dibuat!')
            }
            resetForm()
            fetchProjects() // refresh list
        } catch (err) {
            setMessage(err.response?.data?.message || 'Terjadi kesalahan')
        } finally {
            setSubmitting(false)
            setTimeout(() => setMessage(null), 3000) // pesan hilang 3 detik
        }
    }

    // Hapus project
    const handleDelete = async (id) => {
        if (!window.confirm('Yakin mau hapus project ini?')) return
        try {
            await api.delete(`/projects/${id}`)
            setMessage('Project berhasil dihapus!')
            fetchProjects()
        } catch (e) {
            setMessage('Gagal menghapus project')
        } finally {
            setTimeout(() => setMessage(null), 3000)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header Dashboard */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Hai, {user?.name}! 👋
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Kelola portfolio kamu dari sini
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                    + Tambah Project
                </button>
            </div>

                {/* Flash message */}
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {message}
                    </div>
                )}

                {/* Form create/edit */}
                {showForm && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editProject ? 'Edit Project' : 'Tambah Project Baru'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Judul *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tech Stack (pisah koma)
                                    </label>
                                    <input
                                        type="text"
                                        value={form.tech_stack}
                                        onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                                        placeholder="Laravel, React, Docker"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi *
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        GitHub URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.github_url}
                                        onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Live URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.live_url}
                                        onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="active">Active</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 mt-5">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={form.is_featured}
                                        onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="is_featured" className="text-sm text-gray-700">
                                        Featured
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={submitting}
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                    {submitting ? 'Menyimpan...' : editProject ? 'Update' : 'Simpan'}
                                </button>
                                <button type="button" onClick={resetForm}
                                    className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg text-sm transition-colors">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Project list */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                isAdmin={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}