export default function ProjectCard({ project }) {
    return (
        <div style={{
            border: '1px solid #eee',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <h3>{project.title}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{project.description}</p>

            {project.tech_stack && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                    {project.tech_stack.map((tech) => (
                        <span key={tech} style={{
                            background: '#f0f0f0',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer">GitHub</a>}
                {project.live_url   && <a href={project.live_url}   target="_blank" rel="noreferrer">Live</a>}
            </div>
        </div>
    )
}