import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function PostsTab() {
    const [posts, setPosts]       = useState([])
    const [loading, setLoading]   = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editPost, setEditPost] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage]   = useState(null)
    const [form, setForm]         = useState({
        title: '', excerpt: '', body: '',
        status: 'draft', published_at: ''
    })

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await api.get('/posts', { params: { per_page: 100 } })
            setPosts(res.data.data.data)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchPosts() }, [])

    const resetForm = () => {
        setForm({ title: '', excerpt: '', body: '', status: 'draft', published_at: '' })
        setEditPost(null)
        setShowForm(false)
    }

    const handleEdit = (post) => {
        setEditPost(post)
        setForm({
            title:        post.title,
            excerpt:      post.excerpt || '',
            body:         post.body,
            status:       post.status,
            published_at: post.published_at || '',
        })
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editPost) {
                await api.put(`/posts/${editPost.id}`, form)
                setMessage('Post berhasil diupdate!')
            } else {
                await api.post('/posts', form)
                setMessage('Post berhasil dibuat!')
            }
            resetForm()
            fetchPosts()
        } catch (err) {
            setMessage(err.response?.data?.message || 'Terjadi kesalahan')
        } finally {
            setSubmitting(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin mau hapus post ini?')) return
        try {
            await api.delete(`/posts/${id}`)
            setMessage('Post berhasil dihapus!')
            fetchPosts()
        } catch (e) {
            setMessage('Gagal menghapus post')
        } finally {
            setTimeout(() => setMessage(null), 3000)
        }
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => { resetForm(); setShowForm(true) }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                    + Tambah Post
                </button>
            </div>

            {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {message}
                </div>
            )}

            {/* Form */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {editPost ? 'Edit Post' : 'Tambah Post Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                Excerpt (ringkasan singkat)
                            </label>
                            <input
                                type="text"
                                value={form.excerpt}
                                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ringkasan artikel..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Konten *
                            </label>
                            <textarea
                                value={form.body}
                                onChange={(e) => setForm({ ...form, body: e.target.value })}
                                rows={6}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal publish
                                </label>
                                <input
                                    type="date"
                                    value={form.published_at}
                                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={submitting}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                                {submitting ? 'Menyimpan...' : editPost ? 'Update' : 'Simpan'}
                            </button>
                            <button type="button" onClick={resetForm}
                                className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg text-sm transition-colors">
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Posts list */}
            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">Belum ada post</div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div key={post.id}
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium text-gray-800">{post.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        post.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {post.status}
                                    </span>
                                </div>
                                {post.excerpt && (
                                    <p className="text-gray-500 text-sm line-clamp-1">
                                        {post.excerpt}
                                    </p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                    {post.published_at
                                        ? `Published: ${new Date(post.published_at).toLocaleDateString('id-ID')}`
                                        : `Draft — ${new Date(post.created_at).toLocaleDateString('id-ID')}`
                                    }
                                </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button onClick={() => handleEdit(post)}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg transition-colors">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(post.id)}
                                    className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1 rounded-lg transition-colors">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}