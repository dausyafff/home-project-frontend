import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import ProjectCard from '../components/ProjectCard'
import PostsTab from '../components/PostsTab'

export default function Dashboard() {
    const { user } = useAuth()

    // ── Tab aktif ─────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('projects')

    // ── State Projects ────────────────────────────────────
    const [projects, setProjects]       = useState([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [showForm, setShowForm]       = useState(false)
    const [editProject, setEditProject] = useState(null)
    const [form, setForm]               = useState({
        title: '', description: '', tech_stack: '',
        github_url: '', live_url: '', status: 'active', is_featured: false
    })

    // ── State Skills ──────────────────────────────────────
    const [skills, setSkills]           = useState([])
    const [showSkillForm, setShowSkillForm] = useState(false)
    const [editSkill, setEditSkill]     = useState(null)
    const [skillForm, setSkillForm]     = useState({
        name: '', category: 'backend', level: 3, order: 0, is_visible: true
    })

    // ── State umum ────────────────────────────────────────
    const [submitting, setSubmitting]   = useState(false)
    const [message, setMessage]         = useState(null)

    // ── Fetch data ────────────────────────────────────────
    const fetchProjects = async () => {
        setLoadingProjects(true)
        try {
            const res = await api.get('/projects', { params: { per_page: 100 } })
            setProjects(res.data.data.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingProjects(false)
        }
    }

    const fetchSkills = async () => {
        try {
            const res = await api.get('/skills', { params: { per_page: 100 } })
            setSkills(res.data.data.data)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchProjects()
        fetchSkills()
    }, [])

    // ── Helper tampilkan pesan ────────────────────────────
    const showMessage = (msg) => {
        setMessage(msg)
        setTimeout(() => setMessage(null), 3000)
    }

    // ══════════════════════════════════════════════════════
    // CRUD PROJECTS
    // ══════════════════════════════════════════════════════

    const resetForm = () => {
        setForm({
            title: '', description: '', tech_stack: '',
            github_url: '', live_url: '', status: 'active', is_featured: false
        })
        setEditProject(null)
        setShowForm(false)
    }

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
        // scroll ke atas supaya form terlihat
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmitProject = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const payload = {
            ...form,
            tech_stack: form.tech_stack
                ? form.tech_stack.split(',').map(t => t.trim()).filter(Boolean)
                : [],
        }

        try {
            if (editProject) {
                await api.put(`/projects/${editProject.id}`, payload)
                showMessage('Project berhasil diupdate!')
            } else {
                await api.post('/projects', payload)
                showMessage('Project berhasil dibuat!')
            }
            resetForm()
            fetchProjects()
        } catch (err) {
            showMessage(err.response?.data?.message || 'Terjadi kesalahan')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteProject = async (id) => {
        if (!window.confirm('Yakin mau hapus project ini?')) return
        try {
            await api.delete(`/projects/${id}`)
            showMessage('Project berhasil dihapus!')
            fetchProjects()
        } catch (e) {
            showMessage('Gagal menghapus project')
        }
    }

    // ══════════════════════════════════════════════════════
    // CRUD SKILLS
    // ══════════════════════════════════════════════════════

    const resetSkillForm = () => {
        setSkillForm({ name: '', category: 'backend', level: 3, order: 0, is_visible: true })
        setEditSkill(null)
        setShowSkillForm(false)
    }

    const handleEditSkill = (skill) => {
        setEditSkill(skill)
        setSkillForm({
            name:       skill.name,
            category:   skill.category,
            level:      skill.level,
            order:      skill.order,
            is_visible: skill.is_visible,
        })
        setShowSkillForm(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmitSkill = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editSkill) {
                await api.put(`/skills/${editSkill.id}`, skillForm)
                showMessage('Skill berhasil diupdate!')
            } else {
                await api.post('/skills', skillForm)
                showMessage('Skill berhasil ditambahkan!')
            }
            resetSkillForm()
            fetchSkills()
        } catch (err) {
            showMessage(err.response?.data?.message || 'Terjadi kesalahan')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteSkill = async (id) => {
        if (!window.confirm('Yakin mau hapus skill ini?')) return
        try {
            await api.delete(`/skills/${id}`)
            showMessage('Skill berhasil dihapus!')
            fetchSkills()
        } catch (e) {
            showMessage('Gagal menghapus skill')
        }
    }

    // ══════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* ── Header greeting ── */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
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
                </div>

                {/* ── Tab navigation ── */}
                {/*
                    Kenapa pakai tab?
                    Daripada scroll panjang, user bisa switch antar section.
                    activeTab menyimpan tab yang sedang aktif.
                    Setiap klik → setActiveTab → conditional render di bawah.
                */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
                    {['projects', 'skills', 'posts'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                activeTab === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Flash message ── */}
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {message}
                    </div>
                )}

                {/* ════════════════════════════════════════
                    TAB: PROJECTS
                    ════════════════════════════════════════ */}
                {activeTab === 'projects' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => { resetForm(); setShowForm(true) }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                                + Tambah Project
                            </button>
                        </div>

                        {/* Form create / edit project */}
                        {showForm && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    {editProject ? 'Edit Project' : 'Tambah Project Baru'}
                                </h2>
                                <form onSubmit={handleSubmitProject} className="space-y-4">
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

                        {/* List projects */}
                        {loadingProjects ? (
                            <div className="text-center py-20 text-gray-400">Loading...</div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                Belum ada project. Tambah project pertamamu!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        isAdmin={true}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteProject}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ════════════════════════════════════════
                    TAB: SKILLS
                    ════════════════════════════════════════ */}
                {activeTab === 'skills' && (
                    <div>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => { resetSkillForm(); setShowSkillForm(true) }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                                + Tambah Skill
                            </button>
                        </div>

                        {/* Form create / edit skill */}
                        {showSkillForm && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                    {editSkill ? 'Edit Skill' : 'Tambah Skill'}
                                </h2>
                                <form onSubmit={handleSubmitSkill} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nama Skill *
                                            </label>
                                            <input
                                                type="text"
                                                value={skillForm.name}
                                                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Laravel"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Kategori *
                                            </label>
                                            <select
                                                value={skillForm.category}
                                                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="backend">Backend</option>
                                                <option value="frontend">Frontend</option>
                                                <option value="devops">DevOps</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Level dengan range slider */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Level: {' '}
                                            <span className="text-blue-500 font-semibold">
                                                {['', 'Pemula', 'Dasar', 'Menengah', 'Mahir', 'Expert'][skillForm.level]}
                                            </span>
                                            {' '}({skillForm.level}/5)
                                        </label>
                                        <input
                                            type="range"
                                            min="1" max="5"
                                            value={skillForm.level}
                                            onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                                            className="w-full accent-blue-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Pemula</span>
                                            <span>Expert</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Urutan tampil
                                            </label>
                                            <input
                                                type="number"
                                                value={skillForm.order}
                                                onChange={(e) => setSkillForm({ ...skillForm, order: parseInt(e.target.value) })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mt-6">
                                            <input
                                                type="checkbox"
                                                id="skill_visible"
                                                checked={skillForm.is_visible}
                                                onChange={(e) => setSkillForm({ ...skillForm, is_visible: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <label htmlFor="skill_visible" className="text-sm text-gray-700">
                                                Tampilkan di portfolio
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="submit" disabled={submitting}
                                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                            {submitting ? 'Menyimpan...' : editSkill ? 'Update' : 'Simpan'}
                                        </button>
                                        <button type="button" onClick={resetSkillForm}
                                            className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg text-sm transition-colors">
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Skills list — dikelompokkan per kategori */}
                        {skills.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                Belum ada skill. Tambah skill pertamamu!
                            </div>
                        ) : (
                            ['backend', 'frontend', 'devops', 'other'].map((cat) => {
                                const filtered = skills.filter(s => s.category === cat)
                                if (filtered.length === 0) return null
                                return (
                                    <div key={cat} className="mb-8">
                                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 capitalize">
                                            {cat}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {filtered.map((skill) => (
                                                <div key={skill.id}
                                                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm mb-1">
                                                            {skill.name}
                                                            {!skill.is_visible && (
                                                                <span className="ml-2 text-xs text-gray-400">(hidden)</span>
                                                            )}
                                                        </p>
                                                        {/* Level dots */}
                                                        <div className="flex gap-1">
                                                            {[1,2,3,4,5].map((dot) => (
                                                                <div key={dot}
                                                                    className={`w-2 h-2 rounded-full transition-colors ${
                                                                        dot <= skill.level
                                                                            ? 'bg-blue-500'
                                                                            : 'bg-gray-200'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditSkill(skill)}
                                                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg transition-colors">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDeleteSkill(skill.id)}
                                                            className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1 rounded-lg transition-colors">
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}

                {/* ════════════════════════════════════════
                    TAB: POSTS
                    Dipisah ke komponen PostsTab supaya
                    file Dashboard tidak terlalu panjang.
                    Ini best practice — separation of concern.
                    ════════════════════════════════════════ */}
                {activeTab === 'posts' && <PostsTab />}

            </div>
        </div>
    )
}