import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading]   = useState(true)
    const [error, setError]       = useState(null)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects')

                // Tambah console.log dulu untuk debug
                console.log('Response dari API:', response.data)

                // Ambil data dengan fallback aman
                const data = response.data?.data ?? []
                setProjects(Array.isArray(data) ? data : [])

            } catch (err) {
                console.error('Error fetch:', err)
                setError('Gagal mengambil data projects')
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>
    if (error)   return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Projects</h2>
            {projects.length === 0 ? (
                <p>Belum ada project.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    )
}